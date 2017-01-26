/**
 * @file
 * Binding Component implementation automatically generated by
 * the Social Communication Platform.
 *
 * Characteristics:
 * - Type: AMQP publisher.
 * - Social Communication Platform Bus: AMQP.
 */

var amqp = require('amqplib/callback_api');
var conf = require('./conf/amqp-sender.conf');
var Message = require('./lib/message');

/**
 * Sends a message to the Social Communication Platform Bus.
 * Protocol: AMQP.
 * @param {string} msg - The message to send.
 * @param {string} msg - The destination.
 */
exports.post = function(msg) {
    console.log('sender posting a message to ' + conf.exchange.name);
    connection = 'amqp://' + conf.user + ':' + conf.password +
        '@' + conf.address + ':' + conf.port;
    console.log(connection);
    amqp.connect(connection, function(err, conn) {
        if (err) {
            console.log(err.stack);
        } else {

            connect(err, conn, msg, conf.exchange.name);
        }
    });
};

function connect(err, conn, msg, destination) {

    conn.on('error', function(err) {
        console.log('An error occurred: ' + err.stack);
    });

    conn.createChannel(function(err, ch) {
        ch.assertExchange(destination, conf.exchange.type, {
            durable: true
        });
        message = new Message('', destination, msg);
        ch.publish(destination, '', new Buffer(JSON.stringify(message)));
        console.log(" [x] Sent %s", JSON.stringify(message));
    });
}
