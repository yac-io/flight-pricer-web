import {filterBy, mapBy, max, min, sort} from '@ember/object/computed';
import {computed} from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['results'],

  solutions: [],
  airlines: [],

  sortParam: ['smallestAmount'],

  maxConnection: -1,

  selectedAirlines: filterBy('airlines', 'isSelected', true),

  columnWidth: [100],
  rowHeight: 260,

  smallestPrices: mapBy('solutions', 'smallestAmount'),

  lowestPrice: min('smallestPrices'),
  biggestPrice: max('smallestPrices'),

  priceRangeLowerBound: undefined,
  priceRangeHigherBound: undefined,

  isSortByAmount: computed('sortParam.@each', function () {
    return this.get('sortParam').indexOf('smallestAmount') >= 0;
  }),

  isSortByDepartureTime: computed('sortParam.@each', function () {
    return this.get('sortParam').indexOf('slices.firstObject.originalDepartureTimestamp') >= 0;
  }),

  isSortByArrivalTime: computed('sortParam.@each', function () {
    return this.get('sortParam').indexOf('slices.lastObject.destinationArrivalTimestamp') >= 0;
  }),

  isSortByDuration: computed('sortParam.@each', function () {
    return this.get('sortParam').indexOf('totalDuration') >= 0;
  }),

  filteredSolutions: computed('solutions', 'maxConnection', 'selectedAirlines.[]', 'priceRangeLowerBound', 'priceRangeHigherBound', function () {
    let filteredSolutions = [];
    let maxConnection = parseInt(this.get('maxConnection'));
    let originalSolutions = this.get('solutions');

    let lowerPrice = this.get('priceRangeLowerBound') === undefined ? this.get('lowestPrice') : this.get('priceRangeLowerBound');
    let higherPrice = this.get('priceRangeHigherBound') === undefined ? this.get('biggestPrice') : this.get('priceRangeHigherBound');

    let allowedAirlines = this.get('selectedAirlines');

    originalSolutions.forEach(solution => {
      if (solution.get('smallestAmount') >= lowerPrice && solution.get('smallestAmount') <= higherPrice) {

        let allAirlinesAreInFilterSelection = allowedAirlines.length === 0 || solution.get('airlines').every(airline => {
          return allowedAirlines.mapBy('id').indexOf(airline.get('id')) >= 0;
        });

        if (allAirlinesAreInFilterSelection) {
          let allSliceMeetConnectionRequirement = true;
          solution.get('slices').forEach(slice => {
            if (slice.get('numberOfStops') <= maxConnection) {
              allSliceMeetConnectionRequirement = allSliceMeetConnectionRequirement && true;
            } else {
              allSliceMeetConnectionRequirement = allSliceMeetConnectionRequirement && false;
            }
          });
          if (allSliceMeetConnectionRequirement || maxConnection === -1) {
            filteredSolutions.pushObject(solution)
          }
        }
      }
    });
    return filteredSolutions;
  }),

  sortedSolutions: sort('filteredSolutions', 'sortParam'),

  actions: {
    sortByPrice() {
      this.set('sortParam', ['smallestAmount']);
    },

    sortByDepartureTime() {
      this.set('sortParam', ['slices.firstObject.originalDepartureTimestamp']);
    },

    sortByArrivalTime() {
      this.set('sortParam', ['slices.lastObject.destinationArrivalTimestamp']);
    },

    sortByDuration() {
      this.set('sortParam', ['totalDuration']);
    }


  }


});
