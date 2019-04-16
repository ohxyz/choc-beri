console.log( 'Batch MGMT' );

console.log( 'batches', batches );

var data = {

    name: 'a',
    type: 'base',
    children: [
        { name: 'a1', value: 10, children: [ { name: 'a11', value: 3 } ] },
        { name: 'a2', value: 20 },
        { name: 'a3', value: 30 },
    ]
};

var b = {

    name: 'batches',
    type: 'base',
    children: [

        { name: '0', type: 'stage', children: [
                { name: '15538177824356391', type: 'job', countOfFeatures: 10, runtime: `1'23"`, status: 'built' },
                { name: '15537490165215569', type: 'job', countOfFeatures: 8, runtime: `4'56"`, status: 'waiting' }, 
        ] },
        { name: '1', type: 'stage', children: [
                { name: '15538178472230601', type: 'job', countOfFeatures: 1, runtime: `1'16"`, status: 'built' },
                { name: '15537490165215569', type: 'job', countOfFeatures: 2, runtime: `2'16"`, status: 'failed' },
                { name: '15537490165215569', type: 'job', countOfFeatures: 3, runtime: `3'16"`, status: 'errored' },
                { name: '15537490165215569', type: 'job', countOfFeatures: 4, runtime: `4'16"`, status: 'building' }, 
                { name: '15537490165215569', type: 'job', countOfFeatures: 8, runtime: `5'16"`, status: 'waiting' },
                { name: '15537490165215569', type: 'job', countOfFeatures: 15, runtime: `6'16"`, status: 'aborted' },
        ] },
        { name: '2', type: 'stage', children: [
                { name: '15535557007171934', type: 'job', countOfFeatures: 1, runtime: `7'16"`, status: 'paused' },
                { name: '38740494881083431', type: 'job', countOfFeatures: 3, runtime: `8'16"`, status: 'promoting' },
                { name: '58749174104841739', type: 'job', countOfFeatures: 5, runtime: `9'16"`, status: 'promoted' },
                { name: '58749174104841739', type: 'job', countOfFeatures: 6, runtime: `10'16"`, status: 'decommissioning'},
                { name: '58749174104841739', type: 'job', countOfFeatures: 7, runtime: `11'16"`, status: 'decommissioned' }, 
                { name: '58749174104841739', type: 'job', countOfFeatures: 8, runtime: `12'16"`, status: 'built'}, 
        ] },
    ]
}

var root = d3.hierarchy( b ).sum( d => {

    return d.countOfFeatures + 1;
} );

var nodes = root.descendants();

var width = 500;
var height = 500;
var circlePadding = 5;

var pack = d3.pack()
             .size( [ width, height ] )
             .padding( circlePadding )
             ( root );

var viewBoxValue = `0 0 ${width} ${height}`;

var g = d3.select( '#__batch__circles' )
          .attr( 'width', '100%' )
          .attr( 'height', '100%')
          .attr( 'viewBox', viewBoxValue )
          .attr( 'preserveAspectRatio', 'xMidYMin meet' )
          .append( 'g' );

g .selectAll( 'circle' )
  .data( nodes )
  .enter()
  .append( ( d, i, nodes ) => {

      var g = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
      var circle = createCircle( { cx: d.x, cy: d.y, r: d.r } );

      g.classList.add( '__g' );
      circle.classList.add( '__g__circle' );
      g.append( circle );

      if ( d.data.type === 'stage' ) {

        g.classList.add( '__g--stage' );
        g.classList.add( '__g--stage-' + d.data.name );

        var stageText = createText( 'STAGE ' + d.data.name, { x: d.x, y: d.y - d.r + 15 } );

        stageText.classList.add( '__g__stage' );
        g.append( stageText );

      }
      else if ( d.data.type === 'job' ) {

        g.classList.add( '__g--job' );

        if ( d.data.status ) {

            g.classList.add( '__g--' + d.data.status );
        }

        var shortId = shortenId( d.data.name );
        var jobIdText = createText( shortId , { x: d.x, y: d.y - 5 } );

        jobIdText.classList.add( '__g__job-id');

        var runtimeContent = `${d.data.runtime} (${d.data.countOfFeatures})`;
        var runtimeText = createText( runtimeContent, { x: d.x, y: d.y + 5 } );

        runtimeText.classList.add( '__g__runtime' );

        var statusText = createText( shortenStatusText( d.data.status ), { x: d.x, y: d.y + 15 } );

        statusText.classList.add( '__g__status' );

        g.append( jobIdText );
        g.append( runtimeText );
        g.append( statusText );

      }
      else if ( d.data.type === 'base' ) {

        g.classList.add( '__g--base' );

      }
      else {

        console.warn( '[Choc] Cirlce type not found.' );
      }

      return g;
   } );

var $jobDetails = null;

$( window ).resize( function () { 

    if ( $jobDetails ) {

        $jobDetails.remove();
    }

} );

$( document ).click( function ( event ) { 

    var $closest = $( event.target ).closest( '#__batch__circles' );

    if ( $closest.length === 0 && $jobDetails ) {

        $jobDetails.remove();
    }
} )

$( '#__batch__circles' )
    .mouseover( function () {

        var $target = $( event.target );
        var activeClass = '__g__circle--active';
        var selectorOfJobCircles = '.__g--job .__g__circle';

        if ( $target.is( '.__g__job-id' ) || $target.is( '.__g__status ') || $target.is( '.__g__runtime' ) ) {

            return;
        }

        $( selectorOfJobCircles, $( this ) ).removeClass( activeClass );

        if ( $target.is( selectorOfJobCircles ) ) {

            $target.addClass( activeClass );
        }
    } )
    .click( function ( event ) { 

        var $target = $( event.target );
        var $circle = $target;

        if ( $target.is( '.__g__job-id' ) || $target.is( '.__g__status ') || $target.is( '.__g__runtime' ) ) {

            $circle = $target.siblings( '.__g__circle' );
        }

        if ( $jobDetails ) {

            $jobDetails.remove();
        }

        if ( $circle.is( '.__g--job .__g__circle' ) ) {

            var rectOfJob = $circle.get(0).getBoundingClientRect();

            var x = rectOfJob.x + rectOfJob.width + 20;
            var y = rectOfJob.y + rectOfJob.height / 2 - 150 ;

            var $template = $( `
                <div class="__job">
                    <div class="__job__header"></div>
                    <div class="__job__content">
                        <div class="__job__row">
                            <div class="__detail">
                                <div class="__detail__title">Job ID</div>
                                <div class="__detail__content">15535557007171934</div>
                            </div>
                        </div>
                        <div class="__job__row">
                            <div class="__detail">
                                <div class="__detail__title">Time Elapsed</div>
                                <div class="__detail__content">12'34"</div>
                            </div>
                        </div>
                        <div class="__job__row">
                            <div class="__detail">
                                <div class="__detail__title">Status</div>
                                <div class="__detail__content">Waiting</div>
                            </div>
                        </div>
                        <div class="__job__row">
                            <div class="__detail">
                                <div class="__detail__title">Features</div>
                                <div class="__detail__content">
                                    <div class="__detail__list">
                                        <div class="__detail__item">
                                            <div class="__feature">
                                                <i class="__feature__icon far fa-star"></i>
                                                <span class="__feature__name">services.NetworkElement</span>
                                            </div>
                                        </div>
                                       <div class="__detail__item">
                                            <div class="__feature">
                                                <i class="__feature__icon far fa-star"></i>
                                                <span class="__feature__name">services.OctaneID</span>
                                            </div>
                                        </div>
                                        <div class="__detail__item">
                                            <div class="__feature">
                                                <i class="__feature__icon far fa-star"></i>
                                                <span class="__feature__name">fixedservice.ServiceType</span>
                                            </div>
                                        </div>
                                        <div class="__detail__item">
                                            <div class="__feature">
                                                <i class="__feature__icon far fa-star"></i>
                                                <span class="__feature__name">fixedservice.SubscriberID</span>
                                            </div>
                                        </div>
                                        <div class="__detail__item">
                                            <div class="__feature">
                                                <i class="__feature__icon far fa-star"></i>
                                                <span class="__feature__name">mobile.recd_del_flg_mobile</span>
                                            </div>
                                        </div>
                                        <div class="__detail__item">
                                            <div class="__feature">
                                                <i class="__feature__icon far fa-star"></i>
                                                <span class="__feature__name">Averyveryveryveryverylongfeauturename</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);

            $jobDetails = $template
                            .css( { position: 'absolute', left: x, top: y } )
                            .appendTo( 'body' );
        }

    } );


function shortenId( id ) {

    return id.slice( 0,3 ) + '...' + id.slice( -3 );
}

function shortenStatusText( status ) {

    if ( status === 'decommissioned' ) return "decomm'd";
    if ( status === 'decommissioning' ) return "decomm'ng";

    return status;
}

function createCircle( attrs = {} ) {

    var circle = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle' );
    var defaults = { cx: 100, cy: 100, r: 100 };
    var o = Object.assign( {}, defaults, attrs );

    for ( var prop in o ) {

        circle.setAttribute( prop, o[ prop ] );
    }

    return circle;
}

function createText( content = '', attrs = {} ) {

    var text = document.createElementNS( 'http://www.w3.org/2000/svg', 'text' );
    var defaults = { x: 100, y: 100, 'text-anchor': 'middle' };
    var o = Object.assign( {}, defaults, attrs );

    for ( var prop in o ) {

        text.setAttribute( prop, o[ prop ] );
    }

    text.textContent = content;

    return text;
}

