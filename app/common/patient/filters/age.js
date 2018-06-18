angular.module('common.patient')
.filter('age', () => age => {
  if (age.years) return age.years + " y";
  if (age.months) return age.months + " m";
  return age.days + " d";
});
