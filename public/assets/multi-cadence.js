var globals = { featureLanguage: '', cadence: '', blockName: '' };

var dummyBlockDetails = [

    { blockName: 'mojo_lab_step', language: 'mojo', zone: 'lab', supportedCadences: [ '1440' ] },
    { blockName: 'mojo_fac_step', language: 'mojo', zone: 'fac', supportedCadences: [ '1440', '5', '60' ] },

    { blockName: 'sql_1', language: 'sql', zone: 'lab', supportedCadences: [ '5' ] },
    { blockName: 'sql_2', language: 'sql', zone: 'fac', supportedCadences: [ '5', '60' ] },

    { blockName: 'mojo_1', language: 'mojo', zone: 'lab', supportedCadences: [ '5' ] },
    { blockName: 'mojo_2', language: 'mojo', zone: 'fac', supportedCadences: [ '5', '1440' ] },

    { blockName: 'python_lab_step', language: 'python', zone: 'lab', supportedCadences: [ '5', '60' ] },
    { blockName: 'python_1', language: 'python', zone: 'lab', supportedCadences: [ '5' ] },

    { blockName: 'pySpark_2', language: 'pySpark', zone: 'fac', supportedCadences: [ '60', '1440' ] },
    { blockName: 'pySpark_fac_step', language: 'pySpark', zone: 'fac', supportedCadences: [ '60' ] },
];

var dummyEventSources = [

    { "cadence": "0005", "subscriptionID": "item_5_1" },
    { "cadence": "0005", "subscriptionID": "item_5_2" },
    { "cadence": "1440", "subscriptionID": "item_1440_1" },
    { "cadence": "0060", "subscriptionID": "item_60_1" },
    { "cadence": "0005", "subscriptionID": "item_5_3" },
    { "cadence": "0060", "subscriptionID": "item_60_1" }
];

var blockDetailsOfLab = dummyBlockDetails.filter( item => item.zone === 'lab' );
var blockDetailsOfFac = dummyBlockDetails.filter( item => item.zone === 'fac' );

console.log( 'lab', blockDetailsOfLab, 'fac', blockDetailsOfFac )

var $multiCadenceContainer = $createMultiCadenceContainer();
var $languageContent = $createLanguageContent( 

    blockDetailsOfLab,

    function ( lang ) { 

        console.log( lang );
    },

    function ( cadence ) {

        var $es = $createEventSourceDropdown( dummyEventSources, cadence );
        $( '.__event-source' ).html( $es );

        $es.hide().fadeIn();
    }
);

$( '.__multi-cadence' ).append( $multiCadenceContainer );
$( '.__multi-cadence__lang .strip__content', $multiCadenceContainer ).html( $languageContent );

function generateQuestionMark() {

    return `<i class="__multi-cadence__icon fas fa-question"></i>`
}

function $createMultiCadenceContainer() {

    return $( `
        <div class="__multi-cadence__content">
            <div class="__multi-cadence__lang strip">
                <div class="strip__title">LANGUAGE</div>
                <div class="strip__content"></div>
            </div>
            <div class="__multi-cadence__symbol strip">
                <i class="__multi-cadence__icon fas fa-plus"></i>
            </div>
            <div class="__multi-cadence__cadence strip">
                <div class="strip__title">CADENCE</div>
                <div class="strip__content"></div>
            </div>
            <div class="__multi-cadence__symbol strip">
                <i class="__multi-cadence__icon fas fa-equals"></i>
            </div>
            <div class="__multi-cadence__block strip">
                <div class="strip__title">BLOCK</div>
                <div class="strip__content">
                    ${ generateQuestionMark() }
                </div>
            </div>
        </div>
   ` );
}


function $createEventSourceDropdown( eventSources, cadence='' ) {

    var filteredSources = eventSources.filter( s => parseInt(s.cadence) === parseInt(cadence) );

    var items = filteredSources.map( s => `

        <div class="item" data-value="${s.subscriptionID}">${s.subscriptionID}</div>

    ` ).join( '' );

    var $container = $( `

        <div class="field">
            <label class="field__title" for="event-sources">Event Sources</label>
            <div class="field__content ui fluid search dropdown selection multiple">
                <input id="event-sources" type="hidden" name="event-sources">
                <i class="dropdown icon"></i>
                <div class="default text">Event Sources</div>
                <div class="menu">
                    ${ items }
                </div>
            </div>
        </div>
    ` );

    $( '.dropdown', $container ).dropdown();
    return $container;
}

function $createLanguageContent( blocks, onClick, onCadenceClick ) {

    var $container = $( `<div class="__language">` );
    var languages = [];

    for ( var b of blocks ) {

        if ( languages.includes( b[ 'language' ] ) ) {

            continue;
        }

        languages.push( b[ 'language' ] );

        var $lang = $( `
            <span class="strip__item __language__name" data-value="${b['language']}">
                ${ formatLanguage( b[ 'language' ]) }
            </span>
        ` );
        
        $container.append( $lang );

        $lang.click( function () {

            activateItem( $(this), 'strip__item--active' );

            var lang = this.getAttribute( 'data-value' );

            globals.featureLanguage = lang;
            globals.cadence = '';
            globals.blockName = '';

            var $cadenceContent = $createCadenceContent( blocks, lang, onCadenceClick );

            $( '.__multi-cadence__cadence .strip__content' ).html( $cadenceContent );
            $( '.__multi-cadence__block .strip__content' ).html( generateQuestionMark() );

            onClick( lang );

        } )
    }

    return $container;
}


function $createCadenceContent( blocks, language, onClick ) {

    var $container = $( `<div class="__cadence">` );
    var cadences = [];

    for ( var b of blocks ) {

        if ( b[ 'language' ] === language ) {

            var cad = b[ 'supportedCadences' ].slice();
            for ( var c of cad ) {

                if ( cadences.includes( c ) ) {

                    continue;
                }
                else {

                    cadences.push( c );

                    var $c = $( `<div class="strip__item __cadence__name" data-value="${c}">${formatCadence(c)}</div>` );

                    $container.append( $c );

                    $c.click( function () {

                        activateItem( $(this), 'strip__item--active' );

                        var cadence = this.getAttribute( 'data-value' );

                        globals.cadence = cadence;
                        globals.blockName = '';

                        var $blockContent = $createBlockContent( blocks, language, cadence );

                        $( '.__multi-cadence__block .strip__content' ).html( $blockContent );

                        onClick( cadence );

                    } );
                }
            }
        }
    }

    return $container;
}

function $createBlockContent( blocks, language, cadence ) {

    var $container = $( `<div class="__block">` );

    for ( var b of blocks ) {

        if ( b[ 'language' ] === language && b[ 'supportedCadences' ].includes( cadence ) ) {

            var $b = $( `
                <div class="strip__item __block__name" data-value="${ b['blockName'] }">
                    ${ b['blockName'] }
                </div>
            ` );

            $container.append( $b );

            $b.click( function () { 

                activateItem( $(this), 'strip__item--active' );

                var block = this.getAttribute( 'data-value' );

                globals.blockName = block;

            } );
        }
    }

    return $container;
}

/**
 * Activate item and de-activate it's siblings
 */

function activateItem( $item, activeClass='' ) {

    $item.addClass( activeClass );
    $item.siblings().removeClass( activeClass );
}

function formatCadence( mins ) {

    if ( isNaN( mins ) || mins < 0 ) {
        
        return 'n/a';
    }
    if ( mins < 60 ) {

        return mins + ' mins';
    }
    else if ( mins == 60 ) {

        return '1 hr';
    }
    else {

        var hrs = Math.floor( mins / 60 );
        var mins = mins % 60;

        if ( mins === 0 ) {

            return `${hrs} hrs`;
        }
        else {

            return `${hrs} hrs ${mins} mins`;
        }   
    }
}

function formatLanguage( lang ) {

    var l = lang.toLowerCase();

    if ( l === 'sql' )           return 'SQL';
    else if ( l === 'python' )   return 'Python';
    else if ( l === 'pyspark' )  return 'PySpark';
    else if ( l === 'mojo' )     return 'MOJO';
    else                         return 'n/a';
}