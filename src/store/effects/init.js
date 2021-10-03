export default {
  async initialize(actions) {
    actions.window.initialize();


    console.log('check if user is logged in...');

    const { token, userId } = await actions.getStoredAuthToken();
    await actions.loginWithToken({ token, userId });
  }
}
