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
    var $featurePanelMain = $( '.feature-panel__main', $featurePanel );
    var $pageContent = $( '.page__content' );
    var heightOfPageHeader = $( '.page__header' ).height();

    $( '.feature-status__feature-name' ).click( function () { 

        $featurePanel.toggle();
    } );

    $( '.feature-panel__close-icon' ).click( function () { 

        $featurePanel.hide();
    } );

} )();