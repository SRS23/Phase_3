package CrudOperations.Project_2;

import static io.restassured.RestAssured.given;

import org.testng.annotations.Test;

import io.restassured.builder.RequestSpecBuilder;
import io.restassured.builder.ResponseSpecBuilder;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import io.restassured.specification.ResponseSpecification;
import payLoad.JsonnDataa;
import payLoad.URIlinks;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.config.Configurator;




public class Api_2_Post {

	private static final Logger logger = LogManager.getLogger(Api_2_Post.class);

	
	@Test
	public void apiPost() {
		
		String log4jpath =  "F:\\svl svs\\My projects\\Phase -3 projects\\Course end project 2\\REst\\Project_2\\resources\\log4j2.xml";
		Configurator.initialize(null, log4jpath);
		
		logger.info("");
		logger.info("Api 2  Test get Started. ");
		
		RequestSpecification request = new RequestSpecBuilder().setBaseUri(URIlinks.postURI).build();
		
		logger.info("Data passing from JsonnDataa class. ");
		RequestSpecification request1 = given().spec(request).body(JsonnDataa.postData());
		
		ResponseSpecification response = new ResponseSpecBuilder().expectStatusCode(201).expectContentType(ContentType.JSON).build();
		
		Response response1 = request1.when().post().then().log().all().spec(response).extract().response();
		
		String response2 = response1.asPrettyString();
		
		System.out.println(response2);
		
		
		  
		JsonPath js = new JsonPath(response2);
		
		String Create = js.get("createdAt");
		
		String Id = js.getString("id");
		System.out.println("The id is : "+Id);
		System.out.println();
		
		String []Word = Create.split(":");
		
		if(Word[0].contains("2023")==true) {
			System.out.println(Word[0] +Word[1] +Word[2]+" its passed. ");
		}
		else {
			System.out.println("its failed");
		}
		
		logger.info("");
		 logger.info(" Api 2 Test Completed Successfully. ");
		
	}
	
	
	
}
