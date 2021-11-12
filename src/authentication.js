const axios = require("axios");
const {
  AuthenticationService,
  JWTStrategy,
} = require("@feathersjs/authentication");
const { LocalStrategy } = require("@feathersjs/authentication-local");
const {
  expressOauth,
  OAuthStrategy,
} = require("@feathersjs/authentication-oauth");

class FacebookStrategy extends OAuthStrategy {
  async getProfile(authResult) {
    // This is the OAuth access token that can be used
    // for Facebook API requests as the Bearer token
    const accessToken = authResult.access_token;

    const { data } = await axios.get("https://graph.facebook.com/me", {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      params: {
        // There are
        fields: "id,name,email,picture",
      },
    });

    return data;
  }

  async getEntityData(profile) {
    // `profile` is the data returned by getProfile
    const baseData = await super.getEntityData(profile);

    return {
      ...baseData,
      name: profile.name,
      email: profile.email,
    };
  }
}

// This is a Github login

class GitHubStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);

    return {
      ...baseData,
      // You can also set the display name to profile.name
      name: profile.login,
      // The GitHub profile image
      avatar: profile.avatar_url,
      // The user email address (if available)
      email: profile.email,
    };
  }
}

module.exports = (app) => {
  const authentication = new AuthenticationService(app);

  authentication.register("jwt", new JWTStrategy());
  authentication.register("local", new LocalStrategy());
  authentication.register("github", new GitHubStrategy());
  authentication.register("facebook", new FacebookStrategy());

  app.use("/authentication", authentication);
  app.configure(expressOauth());
};
