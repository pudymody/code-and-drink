# code-and-drink
Code and drink is a game where a problem is shown, and you have to solve it with js. If you get a syntax error, you drink, if you get the wrong answer, you drink, if anyone finish, the others drinks. As simple as that.

# Usage
First, you need a server running which will check the submitted data. For this you need to edit the function called **check** in *server.js* which should return **true** when the given data is the expected output, if you want to give initial values, you should also edit the js object called *initialCtx*.

After that, you should launch the server
``` node server.js ```

Now every player, should start the client calling
``` node client.js file-editing nickname server-ip```

* *file-editing* is the file which is going to be submitted to the server whenever a new change is saved.
* *nickname* is the nickname of the player
* *server-ip* the ip of the machine running the server.

# More
You can read more about the development in my [blog](http://pudymody.github.io/blog/2016-003-03-first-coding-drinking-game)
