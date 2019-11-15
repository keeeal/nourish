max_energy = 10;

function Card(name, energy, protein, carbs) {
  this.name = name;
  this.energy = energy;
  this.protein = protein;
  this.carbs = carbs;
}

var cards = [
  new Card("A", 4, 5, 3),
  new Card("B", 5, 5, 9),
  new Card("C", 7, 5, 3),
];

var selected = []

function update_ui() {

}

for (i = 0; i < cards.length; i++) {
  $( "main" ).append(
    "<div id='" + cards[i].name + "' class='card mdl-card mdl-shadow--2dp'><div class='mdl-card__title'><h2 class='mdl-card__title-text'>" + cards[i].name + "</h2></div><div class='mdl-card__supporting-text'>Energy: " + cards[i].energy + "</div><div class='mdl-card__supporting-text'>Protein: " + cards[i].protein + "</div><div class='mdl-card__supporting-text'>Carbs: " + cards[i].carbs + "</div><div class='mdl-card__menu'><button class='mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect'><i class='material-icons'>edit</i></button></div></div>"
  )
}

$( ".card" ).on( "click", function( event ) {
  id = $( event.target ).parent( ".card" ).attr('id');
});
