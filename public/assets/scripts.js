( () => {

    let $mobileMenuButton = $( '.mobile-menu__button' );
    let $container = $( '.container' );

    $mobileMenuButton.click( () => { 

        $container.toggleClass( 'container--mobile' );
    } );

} )();