//GDPR protection method

const gdprProtectionMethod = async () => {
  try {
    let response = await window.api.gdprProtection();

    if (response) {
      console.log('Clearing gdpr data:', response);
      return response;
    } else {
      console.error('Empty response received');
      return null;
    }
  } catch (error) {
    console.error('Error clearing gdpr data:', error.message);
  }
};

export default gdprProtectionMethod;
