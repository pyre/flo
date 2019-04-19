# -*- Python -*-
# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#

# get the package
import flo

# declaration
class debug(flo.command, family='flo.actions.debug'):
    """
    An example command
    """


    # meta-data
    pyre_tip = "an example of a user supplied command"


    # behaviors
    @flo.export(tip='convenience action for debugging the plexus')
    def test(self, plexus, **kwds):
        """
        Convenient resting point for debugging code during development
        """
        # show me
        plexus.info.log(self.pyre_name)
        # all done
        return


# end of file
