var TimeseriesData = (function() {
  return Backbone.Model.extend({
    storage: new StorageService(),

    initialize: function() {
      //this.set('timespan', span);
      //this.set('timeseriesMetaData', timeseriesMetaData);
      //Init like so: var tsd  = new TimeseriesData({tsId: 'ts_35559ca6b2248629e6dcdc65ceead0ed', span: '2013-09-17/2013-09-17'})
      this.set('synced', false);
    },

    fetch: function() {
      //Caching goes here!

      var timespan = this.get('timespan').din;
      var timeseriesId = this.get('timeseriesMetaData').get('id');
      var context = this;

      $.ajax({
        type: "GET",
        url: "http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/timeseries/" + timeseriesId + "/getData",
        data: { timespan: timespan} //, expanded: false}
      }).done(function(data) {
        var values = [];
        _.each(data.values, function(elem) {
          values.push([elem.timestamp, elem.value]);
        }, context)

        context.set('values', values);
        context.set('synced', true);
        context.trigger("sync", context);
      }).fail(function() {
        Helpers.showErrorMessage('Server error', 'Could not fetch the timeseries data fot the timeseries with ID: ' + timeseriesId + ". Please try again later...");
        this.set('synced', true);
        context.trigger("sync", context);
      });
    }
   
  });
})();