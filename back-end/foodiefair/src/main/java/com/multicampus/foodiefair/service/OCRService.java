package com.multicampus.foodiefair.service;

import org.json.JSONObject;

public interface OCRService {

    public boolean sendOcrRequest(String base64Data, String productName);
    public boolean checkOcrResponse(JSONObject jsonResponse, String productName);

}
