package com.multicampus.foodiefair.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.json.JSONArray;
import org.json.JSONObject;

@Service
public class OCRServiceImpl implements OCRService {

    private static final String API_URL = "REMOVED";
    private static final String SECRET_KEY = "REMOVED=";

    public boolean sendOcrRequest(String base64Data, String productName) {
        try {
            URL url = new URL(API_URL);
            HttpURLConnection con = (HttpURLConnection)url.openConnection();
            con.setUseCaches(false);
            con.setDoInput(true);
            con.setDoOutput(true);
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json; charset=utf-8");
            con.setRequestProperty("X-OCR-SECRET", SECRET_KEY);

            JSONObject json = new JSONObject();
            json.put("version", "V2");
            json.put("requestId", UUID.randomUUID().toString());
            json.put("timestamp", System.currentTimeMillis());
            JSONObject image = new JSONObject();
            image.put("format", "png");
            image.put("data", base64Data);
            image.put("name", "testImg01");
            JSONArray images = new JSONArray();
            images.put(image);
            json.put("images", images);
            String postParams = json.toString();

            DataOutputStream wr = new DataOutputStream(con.getOutputStream());
            wr.writeBytes(postParams);
            wr.flush();
            wr.close();

            int responseCode = con.getResponseCode();
            BufferedReader br;
            if (responseCode == 200) {
                br = new BufferedReader(new InputStreamReader(con.getInputStream()));
            } else {
                br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
            }
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = br.readLine()) != null) {
                response.append(inputLine);
            }
            br.close();

            JSONObject jsonResponse = new JSONObject(response.toString())
                    .getJSONArray("images").getJSONObject(0)
                    .getJSONObject("receipt")
                    .getJSONObject("result")
                    ;

            return checkOcrResponse(jsonResponse, productName);
        } catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }

    @Override
    public boolean checkOcrResponse(JSONObject jsonResponse, String productName) {
        // 1. "confirmNum" 이 존재하고, "confirmNum"의 "text" 값이 8자리
        if (!jsonResponse.getJSONObject("paymentInfo").has("confirmNum")
                || jsonResponse.getJSONObject("paymentInfo").getJSONObject("confirmNum").getString("text").length() != 8) {
            return false;
        }

        // 2. productName 문자열이 "subResults"의 "items"의 "name"의 "text" 값을 포함하고 있는 지 (띄어쓰기는 무시하고)
        JSONArray items = jsonResponse.getJSONArray("subResults").getJSONObject(0).getJSONArray("items");
        boolean productFound = false;
        String cleanedProductName = productName.replaceAll("\\s+", "");

        for (int i = 0; i < items.length(); i++) {
            JSONObject item = items.getJSONObject(i);
            String nameText = item.getJSONObject("name").getString("text").replaceAll("\\s+", "");

            if (cleanedProductName.contains(nameText)) {
                productFound = true;
                break;
            }
        }

        if (!productFound) {
            return false;
        }

        // 3. "paymentInfo"의 "date" "formatted"의 "month" 값과 "day" 값이 현재 날짜와 비교해서 30일 이내인지
        JSONObject date = jsonResponse.getJSONObject("paymentInfo").getJSONObject("date").getJSONObject("formatted");
        String month = date.getString("month");
        String day = date.getString("day");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate parsedDate = LocalDate.parse("2023-" + month + "-" + day, formatter);
        LocalDate currentDate = LocalDate.parse("2023-05-03", formatter);

        long daysBetween = ChronoUnit.DAYS.between(parsedDate, currentDate);
        return daysBetween <= 30;
    }

}
