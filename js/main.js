
function sum( objs, mask, attr ) {
  var sum = 0;
  for (var i = 0; i < Math.min(objs.length, mask.length); i++) {
    if (mask[i] && objs[i].hasOwnProperty( attr )) {
      sum += objs[i][attr]
    }
  }
  return sum
}

function Card(props) {
  return (
    <div
      className={"card mdl-card mdl-shadow--2dp" +
        (props.selected ? " selected" : "") +
        (props.disabled ? " disabled" : "")}
      onClick={props.onClick}>

      <div className="mdl-card__title">
        <h2 className="mdl-card__title-text">{props.name}</h2>
      </div>
      <div className="mdl-card__menu">
        <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
          <i className="material-icons">edit</i>
        </button>
      </div>
    </div>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limits: {
        energy: 10,
      },
      goals: {
        energy: 6,
      },
      cards: [
        {
          name: "Anchovies",
          energy: 4,
        },
        {
          name: "Brocolli",
          energy: 5,
        },
        {
          name: "Cake",
          energy: 7,
        },
      ],
      selected: [],
      disabled: [],
    };

    this.state.selected = Array(this.state.cards.length).fill(false)
    this.state.disabled = Array(this.state.cards.length).fill(false)
  }

  handleClick(i) {
    const selected = this.state.selected.slice();
    const disabled = Array(this.state.cards.length).fill(false)
    selected[i] = ! selected[i]

    for (var attr in this.state.limits) {
      if (this.state.limits.hasOwnProperty(attr)) {
        var attr_selected = sum(this.state.cards, selected, attr)
        var attr_limit = this.state.limits[attr]

        for (var i = 0; i < disabled.length; i++) {
          if (! selected[i]) {
            if (this.state.cards[i][attr] + attr_selected > attr_limit) {
              disabled[i] = true;
            }
          }
        }
      }
    }

    this.setState({selected: selected, disabled: disabled});
  }

  renderCard(i) {
    return <Card
      key={i}
      selected={this.state.selected[i]}
      disabled={this.state.disabled[i]}
      name={this.state.cards[i].name}
      energy={this.state.cards[i].energy}
      onClick={() => this.handleClick(i)}
    />;
  }

  render() {
    return (
      this.state.cards.map((value, index) => {
        return this.renderCard(index)
      })
    );
  }
}

ReactDOM.render(
  <Board />,
  document.getElementById('board')
);

$( ".card" ).draggable({
  containment: "#board",
  scroll: false,
});

$( ".card" ).each(function( index ) {
  $( this ).css({
    transform: "rotate(" + (30*Math.random() - 15) + "deg)",
  });
});
