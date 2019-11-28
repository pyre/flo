#-*- coding: utf-8 -*-


# support
import flo


# declaration
class Config(flo.shells.command, family="flo.cli.config"):
    """
    Display configuration information about the {flo} package
    """


    # version info
    @flo.export(tip="the version information")
    def version(self, **kwds):
        """
        Print the version of the flo package
        """
        # print the version number
        print(f"{flo.meta.version}")
        # all done
        return 0


    # configuration
    @flo.export(tip="the top level installation directory")
    def prefix(self, **kwds):
        """
        Print the top level installation directory
        """
        # print the version number
        print(f"{flo.prefix}")
        # all done
        return 0


    @flo.export(tip="the directory with the executable scripts")
    def path(self, **kwds):
        """
        Print the location of the executable scripts
        """
        # print the version number
        print(f"{flo.prefix}/bin")
        # all done
        return 0


    @flo.export(tip="the directory with the python packages")
    def pythonpath(self, **kwds):
        """
        Print the directory with the python packages
        """
        # print the version number
        print(f"{flo.home.parent}")
        # all done
        return 0


# end of file
