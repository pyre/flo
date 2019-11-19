# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# externals
import flo


# declaration
class Workspaces(flo.shells.command, family='flo.actions.ws'):
    """
    Manage workspaces
    """


    # commands
    @flo.export(tip="create a new workspace")
    def new(self, plexus, **kwds):
        """
        Create a new workspace
        """
        # show me
        plexus.info.log(r"creating a new workspace")
        # all done
        return


# end of file
