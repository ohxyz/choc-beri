( function () {

/* Intended for globals ***************************************************************************/

    var $container = $( '.container' );

/* Mobile view toggle *****************************************************************************/

    var $mobileMenuButton = $( '.mobile-menu__button' );

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
    var $container = $( '.container' );
    
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
        $container.addClass( 'container--split' );
    } );

    $( document ).mouseup( function ( event ) { 

        shouldStartSplit = false;
        $container.removeClass( 'container--split' );

    } );

/* Sementic UI ************************************************************************************/
    
    $( '.ui.dropdown' ).dropdown();

/* Semantic UI - customized ***********************************************************************/

    function createModal( className = '' ) {

        var $modal = $( `<div class="ui modal ${className}">` );
        var $header = $( '<div class="header">' );
        var $content = $( '<div class="content">');
        var $actions = $( '<div class="actions">' );
        var $closeButton = $( `
            <div class="ui cancel button">
                <i class="fa fa-times"></i>
                <span>Close<span>
            </div>
        ` );

        $modal.append( $header, $content, $actions );
        $actions.append( $closeButton );

        return {

            $modal,
            $header,
            $content,
            $actions,
            $closeButton
        }
    }

    function $createTag( iconClass = '', content = '' ) {

        return $( `
            <span class="tag">
                <i class="tag__icon ${iconClass}"></i>
                <span class="tag__contnet">${content}</span>
            </span>
        ` );
    }

    function showCreateJobSuccessModal( featureStoreName, jobId ) {

        var modal = createModal( 'basic modal--create-job-success' );
        var $headerIcon = $( '<i class="far fa-check-circle">' );
        var $headerContent = $( `<div>Feature store <em>${featureStoreName}</em> created successfully</div>`);

        modal.$header.append( $headerIcon, $headerContent );
        modal.$content.text( 'Job ID: ' + jobId );
        modal.$modal
             .modal('setting', 'transition', 'fade' )
             .modal( 'show' );
    }

    function showCreateJobWaitModal( headerContent, contentContent ) {

        var modal = createModal( 'basic modal--create-job-wait' );
        var $headerIcon = $( '<i class="far fa-hourglass">' );
        var $headerContent = $( `<div>${headerContent}</div>`);

        modal.$header.append( $headerIcon, $headerContent );
        modal.$content.text( contentContent );
        modal.$modal
             .modal('setting', 'transition', 'fade' )
             .modal( 'show' );
    }

    function showCreateJobStatusModal( { modalClass, iconClass, headerContent, contentContent } ) {

        // Todo: Create a base function of status of modal, eg. success, wait/pending, fail/error, etc
    }

    function showValidateSuccessModal( data = {}, onCreateJobButtonClick = () => {} ) {

        var modal = createModal( 'modal--validate-success' );
        var $metadataTag = $createTag( 'fas fa-scroll', 'Metadata' );
        var $pre = $( '<pre>' );
        var $jobId = $( '<div id="job-id">' );
        var $createJobStatus = $( '<div class="create-job__status">' );
        var $createJobButton = $( `
            <div class="create-job__button ui button">
                <i class="fas fa-dumbbell"></i>
                <span>Create Job</span>
            </div>
         ` );

        var $headerIcon = $( '<i class="far fa-smile">' );
        var $headerContent = $( '<span>' ).text( 'Code validation was successful' );

        $pre.text( JSON.stringify( data , null, 2 ) );

        $jobIdTag = $createTag( 'far fa-id-card', 'Job ID' );
        $jobIdContent = $( `<span class="job-id__content">${data.jobID}</span>` );

        $jobId.append( $jobIdTag, $jobIdContent );

        modal.$header.append( $headerIcon, $headerContent );
        modal.$content.append( $metadataTag, $pre, $jobId, $createJobStatus );
        modal.$actions.append( $createJobButton );
        modal.$modal.modal( 'show' );

        $createJobButton.click( function () { 

            onCreateJobButtonClick();
            
        } );
    }

    var data = {
      "dataSources": {
        "glue": {
          "idv": {
            "s_octf_nbn_srvc": {
              "database": "idv",
              "name": "s_octf_nbn_srvc",
              "service": "glue",
              "entity": "entity"
            }
          }
        }
      },
      "dependencies": {},
      "features": {
        "sp1": {
          "featureName": "sp1",
          "dataType": "TINYINT"
        }
      },
      "featureStore": "fixedservice",
      "scriptLanguage": "SQL",
      "feature_input": "select u.srvc_bk, service_provider as sp1\nfrom s_octf_nbn_srvc u\ninner join\n(select srvc_bk from s_octf_nbn_srvc\n group by srvc_bk having count(srvc_bk)=1) uniquenames\non uniquenames.srvc_bk = u.srvc_bk ",
      "jobID": "15526284243337060",
      "jobOutcome": "success",
      "entity": "srvc_bk"
    }


/* Create feature store ***************************************************************************/

    $( '.validate-button', '.main__content--create-feature-store' ).click( function () { 

        showValidateSuccessModal( data, function () {

            showCreateJobSuccessModal( 'fixedservice', 1234567890 ); 
        } );
    } );

/* Upload scripts *********************************************************************************/

    $( '.validate-button', '.main__content--upload-scripts' ).click( function () { 

        showValidateSuccessModal( data, function () {

            var header = "You job is being created. Please wait...";
            var content = "Job ID: " + Math.random().toString().slice(2);

            showCreateJobWaitModal( header, content ); 
        } );
    } );

} )();