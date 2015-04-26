const KAMEHAMEHA_REGEX = /\sKAM\s/g;

function processAddress(address) {
  // Check if address contains "KAM"
  address = address.replace(KAMEHAMEHA_REGEX, " KAMEHAMEHA ");
  return address;
}

module.exports = {processAddress};
