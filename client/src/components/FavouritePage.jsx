import React from 'react';

export default function FavouritePage() {
  return (
    <div>
      <h1>Favourite Page</h1>
      <p>This is the content for the Favourite page.</p>
      <pre>
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
</pre>
    </div>
  );
}