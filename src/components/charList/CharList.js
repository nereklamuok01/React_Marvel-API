import {Component} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spiner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false,
    }
    
    marvelService = new MarvelService();

    componentDidMount() { 
       this.onRequest();
    }
    //request to the server ,1stt time we call it when component did mount without argument to orientate on baseOffset,when this method running we have method onCharListLoading which switch our new state to true,1st time call doesnt do anything,then after click on the button we switch sttate of on charListLoading to true and we will orientate with our button on this state,we will put atribute on disabled.

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }
    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }
//Then when we got our elements from server  we running onCharListLoaded  which get new data ,from this data we form new state,when we 1st time runned on charListLoaded ...charList(old elements) will be with empty massive, + and we will have only ...newCharList(new elements) which unfold in new elements=> massive we use in char list => then charlist will form our structure 
    onCharListLoaded = (newCharList) => {
        let ended= false;
        if(newCharList.length < 9){
            ended= true;
        }
        
        this.setState(({offset, charList}) => ({
            
                charList: [...charList, ...newCharList],
                loading: false,
                newItemLoading: false,
                offset: offset + 9,
                charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }
    //using ref for focused element
    itemRefs=[];
    setRef = (ref) => {
        this.itemRefs.push(ref);}
    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }
    
 
    //method for optimization
    renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    onClick={() =>{
                    this.props.onCharSelected(item.id);
                    this.focusOnItem(i);
                    }}
                    onKeyDownCapture={(e)=> {
                        if (e.key === ' ' || e.key === 'Enter'){
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);        
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        //center spinner
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {

        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}
CharList.propTypes = {
   onCharSelected: PropTypes.func.isRequired
}

export default CharList;