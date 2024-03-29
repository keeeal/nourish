
// Board class
// props: none
class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      new_card: {
        name: null,
        energy: null,
        protein: null,
        carbs: null,
        sugar: null,
        fats: null,
        fibre: null,
      },
      limits: {
        energy: 10,
        carbs: 10,
      },
      goals: {
        fibre: 10,
      },

      cards: [],
      selected: [],
      disabled: [],
      totals: {},

      show_menu: false,
      show_form: false,
    }
  }

  // complete my day
  completeMyDay(event) {
    event.preventDefault()
    console.log('complete my day:')
    //for (var i = 0; i < this.state.cards.length; i++) {
    //  console.log(this.state.cards[i].name)
    //}
    // all i want to do is subset cards to find remaining cards
    var remainingCards =[]
    for (var i=0; i < this.state.cards.length; i++){
      if(!this.state.selected[i] && !this.state.disabled[i]){
        remainingCards.push(cards[i])
      }
    }
    // now, we need to estimate efficiencies for each goals
    for (var goal in this.state.goals) {
      var eff =[]
      for (var j = 0; j < remainingCards.length; j++) {
        var relWeight = 0
        for (var limit in this.state.limits) {
          relWeight += remainingCards[limit]/totals[limit]
        }
        // push [value, name] to eff.
        eff.push([remainingCards[goal]/relWeight,remainingCards[name]])
      }
      // sort eff by value, keeping track of card name
      eff.sort(sortFunction);

      // now, need to select from eff and return
      log.console(eff[0])
    }
  }

  sortFunction(a, b) {
      if (a[0] === b[0]) {
          return 0;
      }
      else {
          return (b[0] < a[0]) ? -1 : 1;
      }
  }


  // open the nav menu
  toggleMenu(event) {
    event.preventDefault()
    this.setState({show_menu: ! this.state.show_menu})
  }

  // import cards from a json file
  importCards(event) {
    event.preventDefault()
    console.log("import")
  }

  // download all cards as a json file
  exportCards(event) {
    event.preventDefault()

    // don't download if there are no cards
    if (this.state.cards.length == 0) return

    // download
    let cardsStr = JSON.stringify(this.state.cards)
    let cardsUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(cardsStr)
    let linkElement = document.createElement('a')
    linkElement.setAttribute('href', cardsUri)
    linkElement.setAttribute('download', 'nourish_cards.json')
    linkElement.click()
  }

  updateTotals(cards, selected) {
    this.state.totals = {}
    for (var attr in this.state.limits) this.state.totals[attr] = 0
    for (var attr in this.state.goals) this.state.totals[attr] = 0

    for (var attr in this.state.totals) {
      if (this.state.totals.hasOwnProperty(attr)) {
        for (var i = 0; i < Math.min(cards.length, selected.length); i++) {
          if (selected[i] && cards[i].hasOwnProperty(attr)) {
            this.state.totals[attr] += cards[i][attr]
          }
        }
      }
    }
  }

  // update disabled cards
  updateDisabled(cards, selected) {
    const disabled = Array(cards.length).fill(false)

    for (var attr in this.state.limits) {
      if (this.state.limits.hasOwnProperty(attr)) {
        var attr_total = this.state.totals[attr]
        var attr_limit = this.state.limits[attr]

        for (var i = 0; i < disabled.length; i++) {
          if (! selected[i]) {
            if (attr_limit < cards[i][attr] + attr_total) {
              disabled[i] = true
            }
          }
        }
      }
    }

    this.setState({disabled: disabled})
  }

  // click the card with position 'index' in state.cards
  selectCard(event, index) {
    // don't select if disabled
    if (this.state.disabled[index]) return

    // toggle card selected
    const selected = this.state.selected.slice()
    selected[index] = ! selected[index]

    this.updateTotals(this.state.cards, selected)
    this.updateDisabled(this.state.cards, selected)
    this.setState({selected: selected})
  }

  // delete the card with position 'index' in state.cards
  deleteCard(event, index) {
    event.stopPropagation()

    const cards = this.state.cards.slice()
    const selected = this.state.selected.slice()
    cards.splice(index, 1)
    selected.splice(index, 1)

    this.setState({
      cards: cards,
      selected: selected,
    })
  }

  // called when the add button is clicked
  toggleAddForm(event) {
    this.setState({show_form: ! this.state.show_form})
  }

  // called when text in the add form is changed
  addFormChanged(event) {
    const new_card = Object.assign({}, this.state.new_card)

    // for empty strings store null
    if (event.target.value.length) {
      if (event.target.id == "name") {
        new_card[event.target.id] = event.target.value
      } else {
        new_card[event.target.id] = parseFloat(event.target.value)
      }
    } else {
      new_card[event.target.id] = null
    }

    this.setState({new_card: new_card})
  }

  // called when the add form is submitted
  addFormSubmitted(event) {
    event.preventDefault()

    // don't add a card if values are missing
    for (const value of Object.values(this.state.new_card)) {
      if (value == null) return
    }

    // add new card to cards
    const cards = this.state.cards.slice()
    cards.push(this.state.new_card)
    this.updateTotals(cards, this.state.selected)
    this.updateDisabled(cards, this.state.selected)
    this.setState({
      cards: cards,
      show_form: ! this.state.show_form,
    })
    $(event.target).trigger("reset")
  }

  // render the card with position 'index' in state.cards
  renderCard(index) {
    return <Card
      key={index}
      card={this.state.cards[index]}
      selected={this.state.selected[index]}
      disabled={this.state.disabled[index]}
      onClick={e => this.selectCard(e, index)}
      onDelete={e => this.deleteCard(e, index)}
    />
  }

  // render the board
  render() {
    var rendered_cards = []
    for (var i = 0; i < this.state.cards.length; i++) {
        rendered_cards.push(this.renderCard(i))
    }

    return (
      <div id="board">

        <NavBar
          can_export={this.state.cards.length > 0}
          onMenu={e => this.toggleMenu(e)}
          onExport={e => this.exportCards(e)}
          onImport={e => this.importCards(e)}
          onComplete={e => this.completeMyDay(e)}
        />

        <NavMenu
          show={this.state.show_menu}
          limits={this.state.limits}
          goals={this.state.goals}
          totals={this.state.totals}
        />

        {rendered_cards}

        <AddButton
          tooltip={! this.state.show_form}
          onClick={e => this.toggleAddForm(e)}
        />

        <AddForm
          show={this.state.show_form}
          new_card={this.state.new_card}
          onChange={e => this.addFormChanged(e)}
          onSubmit={e => this.addFormSubmitted(e)}
        />

      </div>
    )
  }
}

// main
ReactDOM.render(
  <Board />,
  document.getElementById("board")
)
