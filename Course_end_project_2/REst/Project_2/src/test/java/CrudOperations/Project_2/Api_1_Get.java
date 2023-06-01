package CrudOperations.Project_2;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.equalTo;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.config.Configurator;
import org.testng.annotations.Test;

import io.restassured.builder.RequestSpecBuilder;
import io.restassured.builder.ResponseSpecBuilder;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import io.restassured.specification.ResponseSpecification;
import payLoad.URIlinks;


public class Api_1_Get {
	
	private static final Logger logger = LogManager.getLogger(Api_1_Get.class);

	@Test
	public void api_1() {
		
		String log4jpath = "F:\\svl svs\\My projects\\Phase -3 projects\\Course end project 2\\REst\\Project_2\\resources\\log4j2.xml";
		Configurator.initialize(null, log4jpath);
		
		logger.info("");
		logger.info("Api 1 Test get  Started. ");
		
		
		RequestSpecification req = new RequestSpecBuilder().setBaseUri(URIlinks.getURI).setRelaxedHTTPSValidation().build();
		RequestSpecification res = given().spec(req);
		
		ResponseSpecification response = new ResponseSpecBuilder().expectStatusCode(200).build();
		
		logger.info("Asserting 4th id email and page number.");
		Response responsee = res.when().get().then().log().all().body("page", equalTo(1))
				.body("data[5].email", containsString("tracey.ramos@reqres.in"))
				.spec(response).extract().response();
		String respo = responsee.asPrettyString();
		
			
		
		System.out.println(respo);
		
		logger.info("Get Test Completed Successfully. ");	
	}
}
