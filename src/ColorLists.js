function GetBackGroundColor(_indx)
{
	var _clr = 'rgba(0, 0, 0, 0.4)';
	switch (_indx) {
    case 0:
        _clr = 'rgba(52, 152, 219, 0.6)';
        break;
    case 1:
        _clr = 'rgba(142, 68, 173, 0.6)';
        break;
    case 2:
        _clr = 'rgba(39, 174, 96, 0.6)';
        break;
    case 3:
        _clr = 'rgba(218, 247, 166, 0.6)';
        break;
    case 4:
        _clr = 'rgba(0, 0, 0, 0.1)';
        break;
    case 5:
        _clr = 'rgba(0, 0, 0, 0.1)';
        break;
    case 6:
        _clr = 'rgba(0, 0, 0, 0.1)';
	}
	
	return _clr;
}