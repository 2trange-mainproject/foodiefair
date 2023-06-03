package com.multicampus.foodiefair.controller;

import com.amazonaws.HttpMethod;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;

import java.io.File;
import java.net.URL;
import java.util.Date;

public class S3Client_nokey {

    private static final String ACCESS_KEY = "";     //네이버 클라우드 자격 증명
    private static final String SECRET_KEY = "";
    private static final String ENDPOINT = "";
    private static final String REGION = "";
    private static final String BUCKET_NAME = "";   //네이버 버킷 이름

    private AmazonS3 s3Client;

    public S3Client_nokey() {
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(ACCESS_KEY, SECRET_KEY);
        AwsClientBuilder.EndpointConfiguration endpointConfiguration = new AwsClientBuilder.EndpointConfiguration(ENDPOINT, REGION);

        this.s3Client = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .withEndpointConfiguration(endpointConfiguration)
                .build();
    }

    //NPC Object Storage에 파일을 업로드하고 URL을 반환하는 메서드
    public String uploadFile(File file, String objectKey) {
        String folderPath = "products/";
        PutObjectRequest putObjectRequest = new PutObjectRequest(BUCKET_NAME, folderPath + objectKey, file);
        s3Client.putObject(putObjectRequest);

        URL url = s3Client.getUrl(BUCKET_NAME, folderPath + objectKey);
        return (url != null) ? url.toString() : null;
    }

    public String uploadUserFile(File file, String objectKey) {
        String folderPath = "users/";
        PutObjectRequest putObjectRequest = new PutObjectRequest(BUCKET_NAME, folderPath + objectKey, file);
        s3Client.putObject(putObjectRequest);

        URL url = s3Client.getUrl(BUCKET_NAME, folderPath + objectKey);
        return (url != null) ? url.toString() : null;
    }

    //NPC Object Storage에 파일을 업로드하고 URL을 반환하는 메서드
    public String uploadReviewFile(File file, String objectKey) {
        String folderPath = "reviews/";
        PutObjectRequest putObjectRequest = new PutObjectRequest(BUCKET_NAME, folderPath + objectKey, file);
        s3Client.putObject(putObjectRequest);

        URL url = s3Client.getUrl(BUCKET_NAME, folderPath + objectKey);
        return (url != null) ? url.toString() : null;
    }

    //이미 업로드된 파일에 대한 SignedUrl을 생성하는 메서드
    public String getProductUrl(String objectKey, int expirationTimeInSeconds) {
        String folderPath = "products/";
        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(BUCKET_NAME, folderPath + objectKey)
                .withMethod(HttpMethod.GET)
                .withExpiration(new Date(System.currentTimeMillis() + expirationTimeInSeconds * 1000));
        URL signedUrl = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
        return signedUrl.toString();
    }

    public String getUserUrl(String objectKey, int expirationTimeInSeconds) {
        String folderPath = "users/";
        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(BUCKET_NAME, folderPath + objectKey)
                .withMethod(HttpMethod.GET)
                .withExpiration(new Date(System.currentTimeMillis() + expirationTimeInSeconds * 1000));
        URL signedUrl = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
        return signedUrl.toString();
    }

    public String getReviewUrl(String objectKey, int expirationTimeInSeconds) {
        String folderPath = "reviews/";
        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(BUCKET_NAME, folderPath + objectKey)
                .withMethod(HttpMethod.GET)
                .withExpiration(new Date(System.currentTimeMillis() + expirationTimeInSeconds * 1000));
        URL signedUrl = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
        return signedUrl.toString();
    }
}
