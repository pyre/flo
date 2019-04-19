# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# external
import re
# support
import flo


# declaration
class UX:
    """
    Translate URLs into actions
    """

    # interface
    def dispatch(self, plexus, server, request):
        """
        Analyze the {request} received by the {server} and invoke the appropriate {plexus} request
        """
        # get the request type
        command = request.command
        # get the request uri
        url = request.url

        # take a look
        match = self.regex.match(url)
        # if there is no match
        if not match:
            # something terrible has happened
            return server.responses.NotFound(server=server)

        # find who matched
        token = match.lastgroup
        # look up the handler
        handler = getattr(self, token)
        # invoke
        return handler(plexus=plexus, server=server, request=request, match=match)


    # handlers
    def version(self, plexus, server, **kwds):
        """
        The client requested the version of the server
        """
        # get the version
        version = "{}.{} build {} on {}".format(*flo.version(), flo.built())
        # all done
        return server.documents.JSON(server=server, value=version)


    def stop(self, plexus, **kwds):
        """
        The client is asking me to die
        """
        # log it
        plexus.info.log("shutting down")
        # and exit
        raise SystemExit(0)


    def document(self, plexus, server, request, **kwds):
        """
        The client requested a document from the {plexus} pfs
        """
        # form the uri
        uri = "/www" + request.url
        # open the document and serve it
        return server.documents.File(uri=uri, server=server, application=plexus)


    def root(self, plexus, server, request, **kwds):
        """
        The client requested the root document
        """
        # grab a channel
        channel = plexus.info

        # on GET
        if request.command == "GET":
            # pull in the payload
            from .graphiql import payload
            # open the document and serve it
            return server.documents.Literal(server=server, value=payload)

        # show me
        channel.log(request.payload)
        # otherwise
        return server.documents.JSON(server=server, value={})


    # private data
    regex = re.compile("|".join([
        r"/(?P<version>version)",
        r"/(?P<stop>stop)",
        r"/(?P<document>(fonts/.+)|(graphics/.+)|(scripts/.+)|(styles/.+)|(.+\.js))",
        r"/(?P<root>.*)",
        ]))


# end of file
