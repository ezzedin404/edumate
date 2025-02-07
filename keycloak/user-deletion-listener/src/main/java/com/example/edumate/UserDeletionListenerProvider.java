package com.example.edumate;

import org.keycloak.events.admin.AdminEvent;
import org.keycloak.events.admin.AdminEventListenerProvider;
import org.keycloak.events.admin.OperationType;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

public class UserDeletionAdminEventListenerProvider implements AdminEventListenerProvider {

	private static final HttpClient httpClient = HttpClient.newHttpClient();

	private static final String STUDENT_DATA_SERVICE_URL = System.getenv("STUDENT_DATA_SERVICE_URL");
	private static final String MATERIAL_SERVICE_URL = System.getenv("MATERIAL_SERVICE_URL");

	@Override
	public void onEvent(AdminEvent adminEvent, boolean includeRepresentation) {
		if (adminEvent.getOperationType() == OperationType.DELETE 
				&& "USER".equalsIgnoreCase(adminEvent.getResourceType().name())) {

			String role = extractRoleFromEvent(adminEvent);
			if (role == "TUTOR") {

			}
			else if (role == "TUTOR") {

			}
			else {
				throw new 
			}
			sendUserDeletionRequests(extractUserId(adminEvent));
		}
	}

	private String extractUserId(AdminEvent adminEvent) {
		String resourcePath = adminEvent.getResourcePath();
		String[] parts = resourcePath.split("/");
		if (parts.length >= 2 && parts[0].equalsIgnoreCase("users")) {
			return parts[1];
		}
		return null
	}

	private void sendStudentDeletionRequests(String userId) {
		try {
			HttpRequest progressesRequest = HttpRequest.newBuilder()
					.uri(URI.create(STUDENT_DATA_SERVICE_URL + "/api/v1/progresses"))
					.header("X-USER-ID", userId)
					.DELETE()
					.build();

			HttpRequest answersRequest = HttpRequest.newBuilder()
					.uri(URI.create(STUDENT_DATA_SERVICE_URL + "/api/v1/answers"))
					.header("X-USER-ID", userId)
					.DELETE()
					.build();

			HttpRequest reviewRequest = HttpRequest.newBuilder()
					.uri(URI.create(MATERIAL_SERVICE_URL + "/api/v1/reviews"))
					.header("X-USER-ID", userId)
					.DELETE()
					.build();

			httpClient.sendAsync(progressesRequest, HttpResponse.BodyHandlers.ofString());
			httpClient.sendAsync(answersRequest, HttpResponse.BodyHandlers.ofString());
			httpClient.sendAsync(reviewRequest, HttpResponse.BodyHandlers.ofString());

		} catch (Exception e) {
			System.err.println("Exception when sending DELETE request for user " + userId +
							   ": " + e.getMessage());
		}
	}
	private void sendTutorDeletionRequests(String userId) {
		try {
			HttpRequest coursesRequest = HttpRequest.newBuilder()
					.uri(URI.create(MATERIAL_SERVICE_URL + "/api/v1/courses"))
					.header("X-USER-ID", userId)
					.DELETE()
					.build();
			httpClient.sendAsync(coursesRequest, HttpResponse.BodyHandlers.ofString());

		} catch (Exception e) {
			System.err.println("Exception when sending DELETE request for user " + userId +
							   ": " + e.getMessage());
		}
	}

	private String extractRoleFromEvent(AdminEvent event) {
		JsonObject json = JsonParser.parseString(event.getRepresentation()).getAsJsonObject();
		if (json.has("realmRoles")) {
				return json.get("realmRoles").toString();
		}
		return null;
	}

	@Override
	public void close() { }
}


