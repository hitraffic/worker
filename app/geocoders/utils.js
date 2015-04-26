const KAMEHAMEHA_REGEX = /KAM\sHWY/g;

function processAddress(address) {
  // Check if address contains "KAM"
  address = address.replace(KAMEHAMEHA_REGEX, "KAMEHAMEHA HWY");
  return address;
}

module.exports = {processAddress};
