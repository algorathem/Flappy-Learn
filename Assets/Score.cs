using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class Score : MonoBehaviour
{
    public static Score _instance;
    [SerializeField] private TextMeshProUGUI _scoreText;
    private int _score;

    private void Awake()
    {
        if (_instance == null)
        {
            _instance = this;
        }
    }
    // Start is called before the first frame update
    void Start()
    {
        _scoreText.text = _score.ToString();
    }

    public void UpdateScore()
    {
        _score++;
        _scoreText.text = _score.ToString();
    }
}
