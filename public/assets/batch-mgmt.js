console.log( 'Batch MGMT' );

console.log( batches );

var data = {

    name: 'a',
    children: [
        { name: 'a1', value: 10, children: [ { name: 'a11', value: 3 } ] },
        { name: 'a2', value: 20 },
        { name: 'a3', value: 30 },
    ]
};

var b = {

    name: 'batches',
    children: [

        { name: '0', type: 'stage', children: [

                { name: '15538177824356391', type: 'job', countOfFeatures: 10, status: 'built' }

            ]
        },

        { name: '1', type: 'stage', children: [

                { name: '15538178472230601', type: 'job', countOfFeatures: 1, status: 'finished' },
                { name: '15537490165215569', type: 'job', countOfFeatures: 2, status: 'failed' },
                { name: '15537490165215569', type: 'job', countOfFeatures: 3, status: 'pending', },
                { name: '15537490165215569', type: 'job', countOfFeatures: 4, status: 'waiting' }, 
                { name: '15537490165215569', type: 'job', countOfFeatures: 10, status: 'unknown' },

            ]
        },

        { name: '2', type: 'stage', children: [

                { name: '15535557007171934', type: 'job', countOfFeatures: 1, status: 'done' },
                { name: '38740494881083431', type: 'job', countOfFeatures: 3, status: 'whoops' },
                { name: '58749174104841739', type: 'job', countOfFeatures: 5, status: 'banned' },
                { name: '58749174104841739', type: 'job', countOfFeatures: 6, status: 'built'},
                { name: '58749174104841739', type: 'job', countOfFeatures: 7, status: 'started' }, 
                { name: '58749174104841739', type: 'job', countOfFeatures: 8, status: 'stopped'}, 
            ]
        },
    ]
}

var root = d3.hierarchy( b ).sum( d => {
    // console.log( d, d.name );
    return d.countOfFeatures;
} );

// console.log( 'root', root );

var nodes = root.descendants();

// console.log( 'nodes', nodes );

var width = 500;
var height = 500;

var pack = d3.pack()
             .size( [ width, height ] )
             .padding( 5 )
             ( root );

var viewBoxValue = `0 0 ${width} ${height}`;

var g = d3.select( '#my-svg-2' )
          .attr( 'width', '100%' )
          .attr( 'height', '100%')
          .attr( 'viewBox', viewBoxValue )
          .append( 'g' );

var slices = g.selectAll( 'circle' )
              .data( nodes )
              .enter()
              .append( ( d, i, nodes ) => {

                  var g = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' ); 
                  var circle = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle' );
                  var text = document.createElementNS( 'http://www.w3.org/2000/svg', 'text');
                  var heading = '';
                  var textX = d.x;
                  var textY = d.y;

                  if ( d.data.type === 'stage' ) {

                      heading = 'Stage ' + d.data.name;
                      textY = d.y - d.r + 20;
                  }
                  else if ( d.data.type === 'job' ) {

                      heading = shortenJobId( d.data.name );
                  }

                  circle.setAttribute( 'cx', d.x );
                  circle.setAttribute( 'cy', d.y );
                  circle.setAttribute( 'r',  d.r );

                  g.append( circle );
                  g.append( text );

                  text.setAttribute( 'x', textX );
                  text.setAttribute( 'y', textY );
                  text.setAttribute( 'text-anchor', 'middle' );
                  text.textContent = heading;

                  var statusText = createText( d.data.status, textX, textY + 12 );

                  g.append( statusText );

                  return g;
               } )

function shortenJobId( jobId ) {

    return jobId.slice(0,3) + '...' + jobId.slice(-3);
}

function createText( content, x, y ) {

    var text = document.createElementNS( 'http://www.w3.org/2000/svg', 'text');

    text.setAttribute( 'text-anchor', 'middle' );
    text.setAttribute( 'x', x );
    text.setAttribute( 'y', y );
    text.textContent = content || '';

    return text;
}