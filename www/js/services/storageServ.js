(function(){
  angular.module('App.services').service('storageServ', ['mathServ', storageServ]);

  function storageServ(mathServ){
    /*
    #Structure#
    {
      {
        storage1 : {
          {
            age : d1,
            element : s1_element1
          },{
            age : d2,
            element : s1_element2,
          },{
            age : d3,
            element : s1_element3
          }
        },
        config : {
          max_cache_size : d1
        }
      },
      {
        storage2 : {
          {
            age : d1,
            element : s2_element1
          },{
            age : d2,
            element : s2_element2
          },{
            age : d3,
            element : s2_element3
          }
        },
        config : {
          max_cache_size : d1
        }
      }, ...
    }
    */
    const config = {
      max_storage_element_size : 3
    };
    var storage = {};

    this.readElementKeys = readElementKeys;
    this.readStorageKeys = readStorageKeys;
    this.isExtElement = isExtElement;
    this.isExtStorage = isExtStorage;
    this.addStorage = addStorage;
    this.putElement = putElement;
    this.readConfig = readConfig;
    this.readStorage = readStorage;
    this.readElement = readElement;
    this.updateElement = updateElement;
    this.deleteStorage = delStorage;
    this.deleteElement = delElement;

    function readElementKeys(key){
      if(!key){
        throw new Error('wrong storage key\n\tstorage key : ' + key);
      }
      if(typeof key != 'string'){
        throw new Error('wrong storage key\n\tstorage key : ' + key);
      }
      if(!isExtStorage(key)){
        throw new Error('not exist storage key\n\t storage key : ' + key);
      }
      return Object.keys(storage[key].storage);
    }
    function readStorageKeys(){
      return Object.keys(storage);
    }
    function isExtElement(key, elem_key){
      if(!key || !elem_key){
        throw new Error('wrong key set\n\tstorage key : ' + key + '\n\telement key : ' + elem_key);
      }
      if(typeof key != 'string' || typeof elem_key != 'string'){
        throw new Error('wrong key set\n\tstorage key : ' + key + '\n\telement key : ' + elem_key);
      }
      if(!isExtStorage(key)){
        throw new Error('not exist storage key\n\t storage key : ' + key);
      }
      return (storage[key].storage[elem_key])?true:false;
    }
    function isExtStorage(key){
      if(!key){
        throw new Error('wrong key set\n\tstorage key : ' + key);
      }
      if(typeof key != 'string'){
        throw new Error('wrong key set\n\tstorage key : ' + key);
      }
      return (storage[key])?true:false;
    }
    function addStorage(){
      switch(arguments.length){
        case 1:
        {
          var key = arguments[0];
          if(!key){
            throw new Error('wrong key');
          }
          if(typeof key != 'string'){
            throw new Error('wrong key');
          }
          if(isExtStorage(key)){
            throw new Error('already exists storage key\n\tinput storage key : ' + key);
          }
          storage[key] = {
            config : {
              max_cache_size : config.max_storage_element_size
            },
            storage : {}
          };
        }
        break;
        case 2:
        {
          var key = arguments[0];
          var max_cache_size = arguments[1];
          if(!key || !max_cache_size){
            throw new Error('wrong key');
          }
          if(typeof key != 'string' || typeof max_cache_size != 'number'){
            throw new Error('wrong key');
          }
          if(isExtStorage(key)){
            throw new Error('already exists storage key\n\tinput storage key : ' + key);
          }
          storage[key] = {
            config : {
              max_cache_size : max_cache_size
            },
            storage : {}
          };
        }
        break;
        default:
        {
          throw new Error('wrong argument length');
        }
        break;
      }
    }
    /*
    constructor
      arg1:string
        //initialize storage with default configuration(maximum cache size : 3)
      arg1:string, arg2:number
        //initialize storage with maximum cache size
    */
    function putElement(key, elem_key, elem){
      if(arguments.length != 3){
        throw new Error('wrong argument length');
      }
      if(!key || !elem_key){
        throw new Error('wrong key set\n\tstorage key : ' + key + '\n\telement key : ' + elem_key);
      }
      if(typeof key != 'string' || typeof elem_key != 'string'){
        throw new Error('wrong key set\n\tstorage key : ' + key + '\n\telement key : ' + elem_key);
      }
      if(!isExtStorage(key)){
        throw new Error('not exist storage key\n\t storage key : ' + key);
      }

      var targetStorage = storage[key];
      var keys = readElementKeys(key);
      if(keys.length >= targetStorage.config.max_cache_size){
        var maxAgeIndex = 0;
        var maxAge = storage[key].storage[keys[maxAgeIndex]].age;
        for(var i = 1;i < keys.length;i++){
          if(maxAge < storage[key].storage[keys[i]].age){
            maxAge = storage[key].storage[keys[i]].age;
            maxAgeIndex = i;
          }
        }
        delElement(key, keys[maxAgeIndex]);
        keys = readElementKeys(key);
      }
      for(var i = 0;i < keys.length;i++){
        storage[key].storage[keys[i]].age++;
      }
      storage[key].storage[elem_key] = {
        age : 0,
        element : elem
      };
    }
    function readConfig(key){
      if(!key){
        throw new Error('wrong key');
      }
      if(typeof key != 'string'){
        throw new Error('wrong key');
      }
      if(!isExtStorage(key)){
        throw new Error('not exists storage\n\tstorage key : ' + key);
      }
      return storage[key].config;
    }
    function readStorage(key){
      if(!key){
        throw new Error('wrong key');
      }
      if(typeof key != 'string'){
        throw new Error('wrong key');
      }
      if(!isExtStorage(key)){
        throw new Error('not exists storage\n\tstorage key : ' + key);
      }
      var keys = readElementKeys(key);
      var tmp = {};
      for(var i = 0;i < keys.length;i++){
        tmp[keys[i]] = storage[key].storage[keys[i]].element;
      }
      return tmp;
    }
    function readElement(key, elem_key){
      if(!key || !elem_key){
        throw new Error('wrong key set\n\tstorage key : ' + key + '\n\telement key : ' + elem_key);
      }
      if(typeof key != 'string' || typeof elem_key != 'string'){
        throw new Error('wrong key set\n\tstorage key : ' + key + '\n\telement key : ' + elem_key);
      }
      if(!isExtStorage(key)){
        throw new Error('not exist storage\n\tstorage key : ' + key);
      }
      if(!isExtElement(key, elem_key)){
        return undefined;
      }
      var keys = readElementKeys(key);
      for(var i = 0;i < keys.length;i++){
        storage[key].storage[keys[i]].age++;
      }
      storage[key].storage[elem_key].age = 0;
      return storage[key].storage[elem_key].element;
    }
    function updateElement(key, elem_key, newElem){
      if(!key || !elem_key){
        throw new Error('wrong key set\n\tstorage key : ' + key + '\n\telement key : ' + elem_key);
      }
      if(typeof key != 'string' || typeof elem_key != 'string'){
        throw new Error('wrong key set\n\tstorage key : ' + key + '\n\telement key : ' + elem_key);
      }
      if(!isExtStorage(key)){
        throw new Error('not exists storage\n\tstorage key : ' + key);
      }
      var oldElement = delElement(key, elem_key);
      putElement(key, elem_key, newElem);
      return oldElement;
    }
    function delStorage(key){
      if(!key){
        throw new Error('wrong key\n\tstorage key : ' + key);
      }
      if(typeof key != 'string'){
        throw new Error('wrong key\n\tstorage key : ' + key);
      }
      if(!isExtStorage(key)){
        throw new Error('not exists storage\n\tstorage key : ' + key);
      }
      var keys = readElementKeys(key);
      for(var i = 0;i < keys.length;i++){
        delete storage[key].storage[keys[i]];
      }
      delete storage[key].config
      delete storage[key].storage;
      delete storage[key];
    }
    function delElement(key, elem_key){
      if(!key || !elem_key){
        throw new Error('wrong key set\n\tstorage key : ' + key + '\n\telement key : ' + elem_key);
      }
      if(typeof key != 'string' || typeof elem_key != 'string'){
        throw new Error('wrong key set\n\tstorage key : ' + key + '\n\telement key : ' + elem_key);
      }
      if(!isExtStorage(key)){
        throw new Error('not exists storage\n\tstorage key : ' + key);
      }
      if(!isExtElement(key, elem_key)){
        return undefined;
      }
      var res = storage[key].storage[elem_key].element;
      delete storage[key].storage[elem_key];
      return res;
    }
  }
})();
