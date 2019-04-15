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

                { name: '15538177824356391', type: 'job', countOfFeatures: 10, status: 'built' },
                { name: '15537490165215569', type: 'job', countOfFeatures: 8, status: 'waiting' },

            ]
        },

        { name: '1', type: 'stage', children: [

                { name: '15538178472230601', type: 'job', countOfFeatures: 1, status: 'built' },
                { name: '15537490165215569', type: 'job', countOfFeatures: 2, status: 'failed' },
                { name: '15537490165215569', type: 'job', countOfFeatures: 3, status: 'errored' },
                { name: '15537490165215569', type: 'job', countOfFeatures: 4, status: 'building' }, 
                { name: '15537490165215569', type: 'job', countOfFeatures: 8, status: 'waiting' },
                { name: '15537490165215569', type: 'job', countOfFeatures: 15, status: 'aborted' },
            ]
        },

        { name: '2', type: 'stage', children: [

                { name: '15535557007171934', type: 'job', countOfFeatures: 1, status: 'paused' },
                { name: '38740494881083431', type: 'job', countOfFeatures: 3, status: 'promoting' },
                { name: '58749174104841739', type: 'job', countOfFeatures: 5, status: 'promoted' },
                { name: '58749174104841739', type: 'job', countOfFeatures: 6, status: 'decommissioning'},
                { name: '58749174104841739', type: 'job', countOfFeatures: 7, status: 'decommissioned' }, 
                { name: '58749174104841739', type: 'job', countOfFeatures: 8, status: 'built'}, 
            ]
        },
    ]
}


var root = d3.hierarchy( b ).sum( d => {
    // console.log( d, d.name );
    return d.countOfFeatures + 1;
} );

// console.log( 'root', root );

var nodes = root.descendants();

// console.log( 'nodes', nodes );

var width = 500;
var height = 500;
var circlePadding = 5;

var pack = d3.pack()
             .size( [ width, height ] )
             .padding( circlePadding )
             ( root );

var viewBoxValue = `0 0 ${width} ${height}`;

var g = d3.select( '#my-svg-2' )
          .attr( 'width', '100%' )
          .attr( 'height', '100%')
          .attr( 'viewBox', viewBoxValue )
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
        var jobIdText = createText( shortId , { x: d.x, y: d.y } );

        jobIdText.classList.add( '__g__job-id');


        var statusText = createText( shortenStatusText( d.data.status ), { x: d.x, y: d.y + 12 } );

        statusText.classList.add( '__g__status' );

        g.append( jobIdText );
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


$( '#my-svg-2' )
    .mouseover( function () {

        var $target = $( event.target );
        var activeClass = '__g__circle--active';
        var selectorOfCircles = '.__g--job .__g__circle';

        if ( $target.is( '.__g__job-id' ) || $target.is( '.__g__status ') ) return;

        $( selectorOfCircles, $( this ) ).removeClass( activeClass )

        if ( $target.is( selectorOfCircles ) ) {

            $target.addClass( activeClass );
        }
    } );


function shortenId( id ) {

    return id.slice( 0,3 ) + '...' + id.slice( -3 );
}

function shortenStatusText( status ) {

    if ( status === 'decommissioned' ) return "decomm 'd";
    if ( status === 'decommissioning' ) return "decomm 'ng";

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