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
import uriLinks.UriData;

public class EmpDataWithId {

	private static final Logger logger = LogManager.getLogger(EmpDataWithId.class);
	
	@Test
	public void getAllEmpDataById () throws InterruptedException {
		
		String log4j1Path = "F:\\svl svs\\My projects\\Phase -3 projects\\Course end project 1\\Rest Assure\\Project_1\\resources\\log4j1.xml";
		Configurator.initialize(null, log4j1Path);
		 
			logger.info("Emp data By id test ");
			RequestSpecification request = new RequestSpecBuilder().setBaseUri(UriData.EmpDetailById).build();
			RequestSpecification request1 = given().spec(request).log().all();
			ResponseSpecification response = new ResponseSpecBuilder().build();
			
			Response response1 = request1.when().get().then().spec(response).extract().response();
			
			String resdata = response1.asPrettyString();
			
			System.out.println();
			
			
			System.out.println("Response data of  emp id is : "+ resdata );
			
			logger.info("Response data of emp id is : "+ resdata);
			
			logger.info("Emp data By id test completed sucessfully..");
			
				
		
		
	}
	
}
