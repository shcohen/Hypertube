import React, {Component} from 'react';
import {connect} from 'react-redux';

import {setLanguage, getTranslation} from '../../store/actions/translate';

import './language-picker.css';

class LanguagePicker extends Component {
  state = {
    lang: 'en'
  };

  languages = [
    ['be', 'Belarusian'],
    ['ca', 'Catalan'],
    ['cs', 'Czech'],
    ['da', 'Danish'],
    ['de', 'German'],
    ['el', 'Greek'],
    ['en', 'English'],
    ['es', 'Spanish'],
    ['et', 'Estonian'],
    ['fi', 'Finnish'],
    ['fr', 'French'],
    ['hu', 'Hungarian'],
    ['it', 'Italian'],
    ['lt', 'Lithuanian'],
    ['lv', 'Latvian'],
    ['mk', 'Macedonian'],
    ['nl', 'Dutch'],
    ['no', 'Norwegian'],
    ['pt', 'Portuguese'],
    ['ru', 'Russian'],
    ['sk', 'Slovak'],
    ['sl', 'Slovenian'],
    ['sq', 'Albanian'],
    ['sv', 'Swedish'],
    ['tr', 'Turkish'],
    ['uk', 'Ukrainian'],
  ];

  onLangChange = (e) => {
    this.props.setLanguage(e.target.value);
    this.props.getTranslation();
  };

  render() {
    return (
      <form className="lang-picker">
        {this.languages.map((l, i) => (
          <div className="dropdown__section language" key={i}>
            <input hidden type="radio" id={l[0]} name="language" value={l[0]} onChange={this.onLangChange}/>
            <label htmlFor={l[0]}>{l[1]}</label>
          </div>
        ))}
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  oldLang: state.translate.lang
});

export default connect(mapStateToProps, {setLanguage, getTranslation})(LanguagePicker);