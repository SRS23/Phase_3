package com.dummyrestapiexample.Project_1;

import static io.restassured.RestAssured.given;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.config.Configurator;
import org.testng.annotations.Test;

import io.restassured.builder.RequestSpecBuilder;
import io.restassured.builder.ResponseSpecBuilder;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import io.restassured.specification.ResponseSpecification;
import payload.DataLoad;
import uriLinks.UriData;

public class EmpUpdate {

	
	private static final Logger logger = LogManager.getLogger();
	
	@Test
	public void empUpdate(){
		
		String log4j1Path = "F:\\svl svs\\My projects\\Phase -3 projects\\Course end project 1\\Rest Assure\\Project_1\\resources\\log4j1.xml";
		Configurator.initialize(null, log4j1Path);
		
		logger.info("");
		logger.info("Emp update test started successfully. ");
		
		RequestSpecification request = new RequestSpecBuilder().setBaseUri(UriData.empUpdate).build();
		
		RequestSpecification request1 = given().log().all().spec(request).body(DataLoad.putData());
		
		ResponseSpecification response = new ResponseSpecBuilder().build();
		
		Response response1 = request1.when().put().then().log().all().spec(response).extract().response();
		
		String response2 = response1.asPrettyString();
		
		System.out.println(response2);
		
		logger.info("");
		logger.info("Emp update test completed sucessfully..");
		
	}
	
}
