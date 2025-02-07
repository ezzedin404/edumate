package com.example.edumate;

import org.keycloak.Config.Scope;
import org.keycloak.events.admin.AdminEventListenerProvider;
import org.keycloak.events.admin.AdminEventListenerProviderFactory;

public class UserDeletionAdminEventListenerProviderFactory implements AdminEventListenerProviderFactory {

    @Override
    public AdminEventListenerProvider create(Scope config) {
        return new UserDeletionAdminEventListenerProvider();
    }

    @Override
    public void init(Scope config) { }

    @Override
    public void postInit(org.keycloak.models.KeycloakSessionFactory factory) { }

    @Override
    public void close() { }

    @Override
    public String getId() {
        return "user-deletion-listener";
    }
}

