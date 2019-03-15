( function () {

/* Mobile view toggle *****************************************************************************/

    var $mobileMenuButton = $( '.mobile-menu__button' );
    var $container = $( '.container' );

    $mobileMenuButton.click( function () { 

        $container.toggleClass( 'container--mobile' );
    } );

/* Feature store header toggle ********************************************************************/
    
    $( '.feature-status__header' ).click( function () {

        var $icon = $( '.feature-status__icon-expand', this );
        var $content = $( this ).next();

        if ( $icon.hasClass( 'fa-plus') ) {

            $icon.removeClass( 'fa-plus' ).addClass( 'fa-minus' );
            $content.show();
        }
        else if (  $icon.hasClass( 'fa-minus') ) {

            $icon.removeClass( 'fa-minus' ).addClass( 'fa-plus' );
            $content.hide();
        }
        
    } );

/* Feature store toggle, all fixedservices, mobile, etc *******************************************/

    $( '.strip__feature-store-name' ).click( function () { 

        var $button = $( this );
        var text = $button.text();

        if ( text === 'all' ) {

            $( '.feature-store' ).show();
            $( '.feature-store__header' ).show();
        }
        else {

            $( '.feature-store' ).hide();
            $( '.feature-store__header' ).hide();
            $( '#' + text ).show();
        }
        
        $( '.strip__feature-store-name' ).removeClass( 'strip__feature-store-name--active' );
        $button.addClass( 'strip__feature-store-name--active' );
    } );

/* Toggle feature panel ***************************************************************************/

    var $main = $( '.main' );
    var $featurePanel = $( '.feature-panel' );

    $( '.feature-status__feature-name' ).click( function () { 

        $featurePanel.toggle();
    } );

    $( '.feature-panel__close-icon' ).click( function () { 

        $featurePanel.hide();
    } );

/* Sementic UI ************************************************************************************/
    
    $( '.ui.dropdown' ).dropdown();

/* ACE Code editor ********************************************************************************/
    
    var editor = ace.edit( 'code-editor' );
    
    editor.setTheme( 'ace/theme/kuroir' );
    editor.session.setMode( 'ace/mode/javascript' );

    $( '.editor__icon--full-screen' ).click( function () { 

        $( '.editor__main' ).get( 0 ).requestFullscreen();
    } );

/* Splitter ***************************************************************************************/
    
    var startPosition = { x: undefined, y: undefined };
    var shouldStartSplit = false;
    var distanceX = 0;
    var $leftPanel = null;
    var $rightPanel = null;
    var $splitterContainer = $( '.splitter' );
    var currentWidth = 0;
    
    $( '.splitter__handle', $splitterContainer ).mousedown( function ( event ) {

        startPosition.x = event.pageX;
        startPosition.y = event.pageY;

        $leftPanel = $splitterContainer.prev();
        $rightPanel = $splitterContainer.next();
        currentWidth = parseFloat( window.getComputedStyle( $rightPanel.get(0) ).width );

        shouldStartSplit = true;
    } );

    $( document ).mousemove( function ( event ) { 

        if ( shouldStartSplit === false || $leftPanel === null || $rightPanel === null ) {

            return;
        }

        distanceX = event.pageX - startPosition.x;
        $rightPanel.width( currentWidth - distanceX );
    } );

    $( document ).mouseup( function ( event ) { 

        shouldStartSplit = false;

    } );

} )();