const { renderMovies } = require('../scripts.js');

test('renderMovies() should add the correct number of movies to the list', async () => {
   // create mock data
   const list = document.createElement('ul');
   list.classList.add('movie-list');
   document.body.appendChild(list);

   const movieData = [{
      episode_id: 4, Title: 'Star Wars: Episode IV - A New Hope', release_date: '1977-05-25', opening_crawl: 'It is a period of civil war...', Ratings: [{ Source: 'Internet Movie Database', Value: '8.6/10' }, { Source: 'Rotten Tomatoes', Value: '93%' }, { Source: 'Metacritic', Value: '90/100' },],
      Director: 'George Lucas',
   },
   {
      episode_id: 5,
      Title: 'Star Wars: Episode V - The Empire Strikes Back',
      release_date: '1980-05-21',
      opening_crawl: 'It is a dark time for the Rebellion...',
      Ratings: [
         { Source: 'Internet Movie Database', Value: '8.7/10' },
         { Source: 'Rotten Tomatoes', Value: '94%' },
         { Source: 'Metacritic', Value: '82/100' },
      ],
      Director: 'Irvin Kershner',
   },
   ];

   // Add mock data in results variabel
   await renderMovies(movieData);

   // Assert
   expect(list.children.length).toBe(2);
});
