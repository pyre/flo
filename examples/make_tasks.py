#!/usr/bin/env python3
# -*- Python -*-
# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# get the package
import flo

# my app
class Tasks(flo.application, family="flo.applications.tasks"):
    """
    Examine the flow node naming strategy
    """

    # interface
    @flo.export
    def main(self, *args, **kwds):
        """
        The main entry point
        """
        # make a channel
        channel = self.info

        # make a new SLC factory
        f = flo.isce.newFormSLC()
        # make a RAW
        raw = flo.isce.newRAW()
        # configure it
        raw.samples = 5000
        raw.lines = 15000
        # make an SLC
        slc = flo.isce.newSLC()
        # bind everything together
        f.raw = raw
        f.slc = slc

        channel.line("tasks:")
        for task in slc.pyre_tasklist():
            channel.line(f"    {task}")
        channel.log()

        # all done
        return 0


# bootstrap
if __name__ == "__main__":
    # instantiate
    app = Tasks(name="tasks")
    # invoke
    status = app.run()
    # and share
    raise SystemExit(status)


# end of file
