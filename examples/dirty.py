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
class Dirty(flo.flow.workflow, family="flo.applications.dirty"):
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

        # make a RAW
        raw = flo.isce.newRAW()
        # and an SLC
        slc = flo.isce.newSLC()
        # make a new SLC factory
        f = flo.isce.newFormSLC()

        # show me the state
        channel.line("after instantiation: dirty:")
        channel.line(f"  raw: {raw.status.dirty}")
        channel.line(f"  formslc: {f.status.dirty}")
        channel.line(f"  slc: {slc.status.dirty}")
        channel.log()

        # bind everything together
        f.raw = raw
        f.slc = slc

        # show me the state
        channel.line("after binding: dirty:")
        channel.line(f"  raw: {raw.status.dirty}")
        channel.line(f"  formslc: {f.status.dirty}")
        channel.line(f"  slc: {slc.status.dirty}")
        channel.log()

        # all done
        return 0


# bootstrap
if __name__ == "__main__":
    # instantiate
    app = Dirty(name="dirty")
    # invoke
    status = app.run()
    # and share
    raise SystemExit(status)


# end of file
