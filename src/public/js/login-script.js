console.log("works");
gapi.load("auth2", () => {
  const auth2 = gapi.auth2.init({
    clientId:
      "80473075047-3kgtuen85mcsp6opdo12d376r752urm0.apps.googleusercontent.com"
  });

  document.querySelector("#login").addEventListener("click", () => {
    auth2.signIn();
  });

  document.querySelector("#logout").addEventListener("click", function() {
    auth2.signOut();
  });

  auth2.isSignedIn.listen(status => {
    console.log(status ? "User logged in" : "User not logged in");
  });

  auth2.currentUser.listen(user => {
    const profile = user.getBasicProfile();

    console.log(profile.getName());
    console.log(profile.getEmail());
    console.log(profile.getImageUrl());
  });
});
