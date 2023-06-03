package com.multicampus.foodiefair.controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import okhttp3.*;
import org.openkoreantext.processor.OpenKoreanTextProcessorJava;
import org.openkoreantext.processor.tokenizer.KoreanTokenizer;
import scala.collection.Seq;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class NaverCombineKorean_nokey {
    private static final String CLIENT_ID = "";
    private static final String CLIENT_SECRET = "";
    private static final String API_URL = "";

    /*public static void main(String[] args) throws IOException {
        String text = "이번에 새로 생겼다고 해서 가봤어요. 인테리어가 정말 예쁘더라구요! 근데 솔직히 인테리어 예쁜 것만 믿고 가는 느낌이에요.. 가격은 비싸고, 음식이 비싼 값을 못하더라구요.";
        //String text = "와플이 정말 맛있어요! 부드러우면서 바삭하니까 하나만으로도 배불리 먹을 수 있어요.";
        //String text = "소금구이 떡갈비&마늘쫑 : 이게 이 도시락의 메인인것 같은데(상품명에 소금구이라고 써있으니 이게 맞겠지) 개인적으로는 좀 별로, 떡갈비에 소금간만 돼 있으니 싱거운 느낌이에요. 역시 떡갈비는 단짠단짠 간장양념인 듯 제육볶음 : 개인적으로는 소금구이 떡갈비보다 맛있게 먹은 반찬. 매콤달콤 고추장양념이 밥이랑 잘 어울립니다. 무생채 & 무 초절임 : 이 도시락의 상큼함 담당. 사람이 고기만 먹고 살 수는 없죠. 고기고기한 반찬 위주의 한식 도시락. 고기반찬이 두 종류나(!)들어 있어 푸짐하게 먹을 수 있는게 장점입니다. 근데 앞서 이야기한 것처럼 메인인 소금구이떡갈비가 별로라 좀 애매하네요.재구매는 없을 것 같습니다.";

        List<String> positive = extractPositiveKeywords(text);
        System.out.println("긍정 평가 (전체) : ");
        for (String p : positive) {
            System.out.print(p + " ");
        }

        System.out.println();

        List<String> negative = extractNegativeKeywords(text);
        System.out.println("부정 평가 (전체) : ");
        for (String n : negative) {
            System.out.print(n + " ");
        }
    }*/

    //긍정 키워드
    public List<String> extractPositiveKeywords(String text) throws IOException {
        OkHttpClient client = new OkHttpClient();
        MediaType mediaType = MediaType.parse("application/json; charset=utf-8");
        String jsonBody = "{\"content\":\"" + text + "\"}";
        RequestBody body = RequestBody.create(mediaType, jsonBody);
        Request request = new Request.Builder()
                .url(API_URL)
                .post(body)
                .addHeader("Content-Type", "application/json; charset=utf-8")
                .addHeader("X-NCP-APIGW-API-KEY-ID", CLIENT_ID)
                .addHeader("X-NCP-APIGW-API-KEY", CLIENT_SECRET)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }

            // JSON 파싱
            String responseBody = response.body().string();
            Gson gson = new Gson();
            JsonObject jsonObj = gson.fromJson(responseBody, JsonObject.class);

            // 각 문장의 키워드 추출
            JsonArray sentences = jsonObj.get("sentences").getAsJsonArray();
            Set<String> keywordSet = new HashSet<>(); // 중복 제거를 위한 Set
            for (JsonElement sentence : sentences) {
                String sentiment = sentence.getAsJsonObject().get("sentiment").getAsString();
                String content = sentence.getAsJsonObject().get("content").getAsString();
                if (sentiment.equals("positive")) {
                    JsonArray highlights = sentence.getAsJsonObject().get("highlights").getAsJsonArray();
                    for (JsonElement highlight : highlights) {
                        int offset = highlight.getAsJsonObject().get("offset").getAsInt();
                        int length = highlight.getAsJsonObject().get("length").getAsInt();
                        String keyword = content.substring(offset, offset + length);
                        keywordSet.add(keyword);
                    }
                }
            }

            // 중복 제거된 Set의 원소들을 다듬어서 List로 만들기
            List<String> positiveKeywords = new ArrayList<>();
            for (String keyword : keywordSet) {
                CharSequence normalized = OpenKoreanTextProcessorJava.normalize(keyword);
                Seq<KoreanTokenizer.KoreanToken> tokens = OpenKoreanTextProcessorJava.tokenize(normalized);

                for (int i = 0; i < tokens.size(); i++) {
                    KoreanTokenizer.KoreanToken token = tokens.apply(i);
                    if (token.pos().toString().startsWith("Adjective")) {
                        String stemmed = token.stem().get();
                        if(!positiveKeywords.contains(stemmed) && !stemmed.equals("있다") && !stemmed.equals("이다") && !stemmed.equals("없다") && !stemmed.equals("같다") && !stemmed.equals("안되다")){
                            positiveKeywords.add(stemmed);
                        }
                    }
                }
            }

            return positiveKeywords;
        }
    }

    //부정 키워드
    public List<String> extractNegativeKeywords(String text) throws IOException {
        OkHttpClient client = new OkHttpClient();
        MediaType mediaType = MediaType.parse("application/json; charset=utf-8");
        String jsonBody = "{\"content\":\"" + text + "\"}";
        RequestBody body = RequestBody.create(mediaType, jsonBody);
        Request request = new Request.Builder()
                .url(API_URL)
                .post(body)
                .addHeader("Content-Type", "application/json; charset=utf-8")
                .addHeader("X-NCP-APIGW-API-KEY-ID", CLIENT_ID)
                .addHeader("X-NCP-APIGW-API-KEY", CLIENT_SECRET)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }

            // JSON 파싱
            String responseBody = response.body().string();
            Gson gson = new Gson();
            JsonObject jsonObj = gson.fromJson(responseBody, JsonObject.class);

            // 각 문장의 키워드 추출
            JsonArray sentences = jsonObj.get("sentences").getAsJsonArray();
            Set<String> keywordSet = new HashSet<>(); // 중복 제거를 위한 Set
            for (JsonElement sentence : sentences) {
                String sentiment = sentence.getAsJsonObject().get("sentiment").getAsString();
                String content = sentence.getAsJsonObject().get("content").getAsString();
                if (sentiment.equals("negative")) {
                    JsonArray highlights = sentence.getAsJsonObject().get("highlights").getAsJsonArray();
                    for (JsonElement highlight : highlights) {
                        int offset = highlight.getAsJsonObject().get("offset").getAsInt();
                        int length = highlight.getAsJsonObject().get("length").getAsInt();
                        String keyword = content.substring(offset, offset + length);
                        keywordSet.add(keyword);
                    }
                }
            }

            // 중복 제거된 Set의 원소들을 다듬어서 List로 만들기
            List<String> negativeKeywords = new ArrayList<>();
            for (String keyword : keywordSet) {
                CharSequence normalized = OpenKoreanTextProcessorJava.normalize(keyword);
                Seq<KoreanTokenizer.KoreanToken> tokens = OpenKoreanTextProcessorJava.tokenize(normalized);

                for (int i = 0; i < tokens.size(); i++) {
                    KoreanTokenizer.KoreanToken token = tokens.apply(i);
                    if (token.pos().toString().startsWith("Adjective")) {
                        String stemmed = token.stem().get();
                        if(!negativeKeywords.contains(stemmed) && !stemmed.equals("있다") && !stemmed.equals("이다") && !stemmed.equals("없다") && !stemmed.equals("같다") && !stemmed.equals("안되다")){
                            negativeKeywords.add(stemmed);
                        }
                    }
                }
            }

            return negativeKeywords;
        }
    }
}

