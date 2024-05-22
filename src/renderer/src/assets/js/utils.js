export const getBaseUrl = () => {
  let platform = window.api.getPlatform();
  console.log(platform);

  let url = "";
  if (platform === "darwin") {
    url = "/index.php/rest/photographer_portal/login";
  } else if (platform === "win32") {
    url = "https://backend.expressbild.org/index.php/rest/photographer_portal/login";
  }

  return { platform, url };
};
