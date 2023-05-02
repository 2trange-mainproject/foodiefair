package com.multicampus.foodiefair;

import org.deeplearning4j.models.embeddings.loader.WordVectorSerializer;
import org.deeplearning4j.models.word2vec.Word2Vec;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.IOException;
import java.util.Collection;

public class WordVec {
    public static void main(String[] args) {
        try {
            // "resources/word2vec/ko.bin" 파일을 불러옵니다.
            ClassPathResource resource = new ClassPathResource("word2vec/ko.bin");

            // File 객체를 생성합니다.
            File modelFile = resource.getFile();

            // 사전 훈련된 Word2Vec 모델을 불러옵니다.
            Word2Vec word2Vec = WordVectorSerializer.readWord2VecModel(modelFile);

            // 주어진 키워드와 유사한 단어를 찾습니다.
            String keyword = "달달함";
            Collection<String> similarWords = word2Vec.wordsNearest(keyword, 10);

            System.out.println("유사한 단어: " + similarWords);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
