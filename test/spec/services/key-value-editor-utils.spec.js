'use strict';

describe('keyValueEditorUtils', function() {
  var keyValueEditorUtils;

  beforeEach(angular.mock.module('key-value-editor'));
  beforeEach(function() {
    inject(function(_keyValueEditorUtils_) {
        keyValueEditorUtils = _keyValueEditorUtils_;
    });
  });

  //
  // afterEach(function() {
  //   console.log('--- end test ----');
  // });

  describe('each()', function() {
    it('calls the callback function for each item in the array', function() {
      var each = keyValueEditorUtils.each;
      var items = ['a','b','c','d'];
      var count = 0;
      each(items, function() {
        count++;
      });
      expect(count).toEqual(4);
    });

    it('calls the callback function once for each item as the first argument', function() {
      var each = keyValueEditorUtils.each;
      var items = ['a','b','c','d'];
      var toTest = [];
      each(items, function(item) {
        toTest.push(item);
      });
      expect(toTest).toEqual(items);
    });
    it('calls the callback function with the item index as the second arg', function() {
      var each = keyValueEditorUtils.each;
      var items = ['a','b','c','d'];
      var toTest = [];
      each(items, function(item, index) {
        toTest.push(index);
      });
      expect(toTest).toEqual([0,1,2,3]);
    });
  });

  describe('reduce()', function() {
    it('transforms a list into another object', function() {
      var reduce = keyValueEditorUtils.reduce;
      var items = ['a','b','c','d'];
      var toTest = reduce(items, function(result, next) {
        return result + next;
      }, '');
      expect(toTest).toEqual('abcd');
    });
  });

  describe('compact()', function() {
    it('removes falsy values from an array', function() {
      var compact = keyValueEditorUtils.compact;
      var items = [0, false, null, undefined, 1, 2, 3];
      var toTest = compact(items);
      expect(toTest).toEqual([1,2,3]);
    });
  });

  describe('contains()', function() {
    it('returns true if the list contains the item requested', function() {
      var contains = keyValueEditorUtils.contains;
      var items = ['a','b','c','d'];
      expect(contains(items, 'a')).toEqual(true);
      expect(contains(items, 1)).toEqual(false);
    });
  });

  describe('first()', function() {
    it('returns the first item in an array', function() {
      var first = keyValueEditorUtils.first;
      expect(first(['foo','bar','baz'])).toEqual('foo');
    });
  });

  describe('last()', function() {
    it('returns the last item in an array', function() {
      var last = keyValueEditorUtils.last;
      expect(last(['foo','bar','baz'])).toEqual('baz');
    });
  });

  describe('get()', function() {
    it('returns the desired top lvl prob of an object', function() {
      var get = keyValueEditorUtils.get;
      var obj = {
        foo: 'bar',
        baz: 'shizzle'
      };
      expect(get(obj, 'foo')).toEqual('bar');
      expect(get(obj, 'baz')).toEqual('shizzle');
    });
  });

  // a typical entry is of the format: {name: '', value: ''}
  // additional keys are added to entries to control the display/interaction of the
  // key-value-editor.  These keys can be removed to 'clean up' the data itself
  // to return to the user.
  var meta = [
    'isReadOnly',
    'isReadonlyKey',
    'cannotDelete',
    'keyValidator',
    'valueValidator',
    'keyValidatorError',
    'valueValidatorError',
    'keyIcon',
    'keyIconTooltip',
    'valueIcon',
    'valueIconTooltip'
  ];

  describe('cleanEntry()', function() {
    it('removes metadata from an entry object', function() {
      var each = keyValueEditorUtils.each;
      var cleanEntry = keyValueEditorUtils.cleanEntry;
      var obj = {name: 'foo', value: 'bar'};
      each(meta, function(item) {
        obj[item] = 'this should be removed';
      });
      expect(cleanEntry(obj)).toEqual({name: 'foo', value: 'bar'});
    });
  });


  describe('cleanEntries()', function() {
    it('removes metadata from each entry in a list of entries', function() {
      var each = keyValueEditorUtils.each;
      var cleanEntries = keyValueEditorUtils.cleanEntries;
      var entries = [
        {name:'foo', value:'bar'},
        {name: 'shizzle', value: 'pop'}
      ];
      each(entries, function(entry) {
        each(meta, function(item) {
          entry[item] = 'this should be removed';
        });
      });
      expect(cleanEntries(entries)).toEqual([
        {name:'foo', value:'bar'},
        {name: 'shizzle', value: 'pop'}
      ]);
    });
  });

  describe('compactEntries()', function() {
    it('removes metadata from each entry and eliminates entries without a defined name or value', function() {
      var each = keyValueEditorUtils.each;
      var compactEntries = keyValueEditorUtils.compactEntries;
      var entries = [
        {name:'foo', value:'bar'},
        {name: 'shizzle', value: 'pop'},
        {name: '', value: ''},
        {name: undefined, value: null}
      ];
      each(entries, function(entry) {
        each(meta, function(item) {
          entry[item] = 'this should be removed';
        });
      });
      expect(compactEntries(entries)).toEqual([
        {name:'foo', value:'bar'},
        {name: 'shizzle', value: 'pop'}
      ]);
    });
  });

  describe('mapEntries()', function() {
    it('turns a list of entries into a map of name: "value" pairs', function() {
      var mapEntries = keyValueEditorUtils.mapEntries;
      var entries = [
        {name:'foo', value:'bar'},
        {name: 'shizzle', value: 'pop'}
      ];
      expect(mapEntries(entries)).toEqual({
        foo: 'bar',
        shizzle: 'pop'
      });
    });
  });


});
