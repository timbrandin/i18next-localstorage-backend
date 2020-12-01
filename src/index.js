import AsyncStorage from '@react-native-community/async-storage';
import * as utils from './utils';

// get from whatever version of react native that is being used.

const storage = {
  setItem(key, value) {
    if (AsyncStorage) {
      return AsyncStorage.setItem(key, value);
    }
  },
  getItem(key, value) {
    if (AsyncStorage) {
      return AsyncStorage.getItem(key, value);
    }
    return undefined;
  }
};

function getDefaults() {
  return {
    prefix: 'i18next_res_',
    expirationTime: 7 * 24 * 60 * 60 * 1000,
    versions: {}
  };
}

class Cache {
  constructor(services, options = {}) {
    this.init(services, options);

    this.type = 'backend';
  }

  init(services, options = {}) {
    this.services = services;
    this.options = utils.defaults(options, this.options || {}, getDefaults());
  }

  read(language, namespace, callback) {
    const store = {};
    const nowMS = new Date().getTime();

    if (!AsyncStorage) {
      return callback(null, null);
    }

    storage.getItem(`${this.options.prefix}${language}-${namespace}`)
      .then(local => {
        if (local) {
          local = JSON.parse(local);
          if (
            // expiration field is mandatory, and should not be expired
            local.i18nStamp && local.i18nStamp + this.options.expirationTime > nowMS &&

            // there should be no language version set, or if it is, it should match the one in translation
            this.options.versions[language] === local.i18nVersion
          ) {
            delete local.i18nVersion;
            delete local.i18nStamp;
            return callback(null, local);
          }
        }

        callback(null, null);
      })
      .catch(err => {
        console.warn(err);
        callback(null, null);
      });
  }

  save(language, namespace, data) {
    if (AsyncStorage) {
      data.i18nStamp = new Date().getTime();

      // language version (if set)
      if (this.options.versions[language]) {
        data.i18nVersion = this.options.versions[language];
      }

      // save
      storage.setItem(`${this.options.prefix}${language}-${namespace}`, JSON.stringify(data));
    }
  }
}

Cache.type = 'backend';

export default Cache;
