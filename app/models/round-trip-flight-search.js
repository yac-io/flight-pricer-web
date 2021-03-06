import DS from 'ember-data';

export default DS.Model.extend({

  origin: DS.attr('string'),
  destination: DS.attr('string'),
  departureDate: DS.attr('date'),
  returnDate: DS.attr('date'),
  numberOfAdults: DS.attr('number'),
  cabin: DS.attr('string'),
  airlines: DS.hasMany('airline'),

  solutions: DS.hasMany('solution'),

});
