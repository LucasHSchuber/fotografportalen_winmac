//GDPR protection method

//clear data in teams table
export const gdprProtectionMethod = async () => {
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

//clear data in teams_history table
export const gdprProtectionMethod_teamshistory = async () => {
  try {
    let response = await window.api.gdprProtection_teamshistory();

    if (response) {
      console.log('Clearing gdpr data for teams history:', response);
      return response;
    } else {
      console.error('Empty response received for teams history');
      return null;
    }
  } catch (error) {
    console.error('Error clearing gdpr data for teams history:', error.message);
  }
};
