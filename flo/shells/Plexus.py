# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# access the pyre framework
import pyre
# and my package
import flo
# my action protocol
from .Action import Action


# declaration
class Plexus(pyre.plexus, family='flo.components.plexus'):
    """
    The main action dispatcher
    """

    # types
    from .Action import Action as pyre_action


    # pyre framework hooks
    # support for the help system
    def pyre_banner(self):
        """
        Generate the help banner
        """
        # show the license header
        return flo.meta.license


    # interactive session management
    def pyre_interactiveSessionContext(self, context=None):
        """
        Go interactive
        """
        # prime the execution context
        context = context or {}
        # grant access to my package
        context['flo'] = flo  # my package
        # and chain up
        return super().pyre_interactiveSessionContext(context=context)


    # virtual filesystem configuration
    def pyre_mountApplicationFolders(self, pfs, prefix):
        """
        Explore the installation folders and construct my private filesystem
        """
        # chain up
        pfs = super().pyre_mountApplicationFolders(pfs=pfs, prefix=prefix)
        # mount an empty web directory
        pfs['www'] = pfs.folder()
        # get the dispatcher
        from .UX import UX
        # instantiate and attach
        self.urlDispatcher = UX()
        # all done
        return pfs


    # shells
    def pyre_respond(self, server, request):
        """
        Fulfill a request from an HTTP {server}
        """
        # get my dispatcher
        dispatcher = self.urlDispatcher
        # if we don't have one
        if dispatcher is None:
            # everything is an error
            return server.responses.NotFound(server=server)
        # otherwise, refresh my understanding of my document root
        self.pfs['www'].discover()
        # and get it to do its thing
        return dispatcher.dispatch(plexus=self, server=server, request=request)


    # private data
    nexus = None # the event dispatcher
    urlDispatcher = None # converter of urls to actions


# end of file
