package com.dummyrestapiexample.Project_1;

import static io.restassured.RestAssured.given;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.config.Configurator;
import org.testng.annotations.Test;

import io.restassured.builder.RequestSpecBuilder;
import io.restassured.builder.ResponseSpecBuilder;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import io.restassured.specification.ResponseSpecification;
import uriLinks.UriData;

public class AllEmpData {

	private static final Logger logger = LogManager.getLogger(AllEmpData.class);
	
	@Test
	public void getAllEmpData() {
		
		String log4j1Path = "F:\\svl svs\\My projects\\Phase -3 projects\\Course end project 1\\Rest Assure\\Project_1\\resources\\log4j1.xml";
		Configurator.initialize(null, log4j1Path);
		
		logger.info("");
		logger.info("Getting all Employees Data using get method. ");
		
		RequestSpecification request = new RequestSpecBuilder().setBaseUri(UriData.allEmpDetails).build();
		
		RequestSpecification request1 = given().spec(request).log().all().contentType(ContentType.JSON);
		
		ResponseSpecification response =  new ResponseSpecBuilder().expectContentType(ContentType.JSON).build();
		
		Response response1 = request1.when().get().then().spec(response).extract().response();
		
		String resdata = response1.asPrettyString();
		
		System.out.println("");
		System.out.println(resdata);
		logger.info("All Employees data getting test completed Successfully.. ");
		
	}
}
