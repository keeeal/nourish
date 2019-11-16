
function Card(props) {
  let styles = {
    left: props.x,
    top: props.y,
    transform: "rotate(" + props.a + "deg)",
  }
  return (
    <div
      id={props.index}
      className={"card" + (props.selected ? " selected " : " ") + "mdl-card mdl-shadow--2dp"}
      style={styles}
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
      cards: [
        {
          name: "A",
          energy: 4,
          x: 100,
          y: 100,
          a: -4,
        },
        {
          name: "B",
          energy: 5,
          x: 500,
          y: 200,
          a: 2,
        },
        {
          name: "C",
          energy: 7,
          x: 1000,
          y: 130,
          a: 7,
        },
      ],
      selected: [],

    };
    this.state.selected = Array(this.state.cards.length).fill(false)
  }

  handleClick(i) {
    console.log(this.state.cards[i].x);
    const selected = this.state.selected.slice();
    selected[i] = ! selected[i]
    this.setState({selected: selected});
  }

  renderCard(i) {
    return <Card
      key={i}
      index={i}
      selected={this.state.selected[i]}
      name={this.state.cards[i].name}
      energy={this.state.cards[i].energy}
      x={this.state.cards[i].x}
      y={this.state.cards[i].y}
      a={this.state.cards[i].a}
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
