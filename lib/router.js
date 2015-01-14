Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() { 
        return [Meteor.subscribe('posts'), Meteor.subscribe('notifications')];
    }
});

Router.route('/', {name: 'postsList'});
// Router.route('/posts/:_id', {
//     name: 'postPage',
//     data: function() { return Posts.findOne(this.params._id); }
// });

Router.route('/posts/:_id/edit', {
    name: 'postEdit',
    data: function() { return Posts.findOne(this.params._id); }
});

var requireLogin = function() {
    if(!Meteor.user()) {
        if(Meteor.loggingIn()){
            this.render(this.loadingtemplate);
        }else{
            this.render('accessDenied');
        }
    }else{
        this.next();
    }
}

var postsEmpty = function() {
    if(Posts.find().count() === 0) {
        this.render('createSomething');
    }else{
        this.next();
    }
}

Router.route('/submit', {name: 'postSubmit'});

Router.map(function () {

    this.route('postPage', {
        path: '/posts/:_id',
        waitOn: function() {
            return Meteor.subscribe('comments', this.params._id);
        },
        data: function() { return Posts.findOne(this.params._id); }
    })

});

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
Router.onBeforeAction(postsEmpty, {only: 'postsList'});